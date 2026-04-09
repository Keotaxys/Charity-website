'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';

export default function TabCampaigns({ showMessage }: { showMessage: (text: string, type: string) => void }) {
  const locale = useLocale();

  const [pageSettings, setPageSettings] = useState({
    header_title_lo: 'ທຸກໆການຊ່ວຍເຫຼືອມີຄວາມໝາຍ',
    header_title_en: 'EVERY CONTRIBUTION COUNTS',
    header_subtitle_lo: 'ຮ່ວມເປັນສ່ວນໜຶ່ງໃນການປ່ຽນແປງສັງຄົມ ຜ່ານໂຄງການຕ່າງໆຂອງພວກເຮົາ. ເງິນທຸກກີບຈະຖືກນຳໄປໃຊ້ຢ່າງໂປ່ງໃສ ແລະ ເກີດປະໂຫຍດສູງສຸດ.',
    header_subtitle_en: 'Be a part of social change through our various campaigns. Every contribution is used transparently for maximum impact.'
  });
  const [loadingSettings, setLoadingSettings] = useState(false);

  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_lo: '',
    title_en: '',
    description_lo: '',
    description_en: '',
    target_amount: '',
    cover_image: '',
    gallery_links: '',
    youtube_link: '',
    facebook_link: '',
    update_date: '' // 💡 ເພີ່ມ Field ໃໝ່ສຳລັບເກັບວັນທີອັບເດດ
  });
  const [loadingCampaign, setLoadingCampaign] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const docRef = doc(db, 'settings', 'campaigns_page');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPageSettings(docSnap.data() as any);
      }
    } catch (error) {
      console.error("Error fetching page settings:", error);
    }

    try {
      const q = query(collection(db, 'campaigns'), orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);
      setCampaignsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'campaigns_page'), pageSettings, { merge: true });
      showMessage(locale === 'lo' ? 'ບັນທຶກຂໍ້ຄວາມ Header ສຳເລັດແລ້ວ!' : 'Header settings saved successfully!', 'success');
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ Header' : 'Error saving header settings', 'error');
    }
    setLoadingSettings(false);
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCampaign(true);

    const galleryArray = formData.gallery_links
      ? formData.gallery_links.split(',').map(link => link.trim()).filter(link => link !== '')
      : [];

    const campaignDataToSave = {
      title_lo: formData.title_lo,
      title_en: formData.title_en,
      description_lo: formData.description_lo,
      description_en: formData.description_en,
      target_amount: Number(formData.target_amount),
      cover_image: formData.cover_image,
      gallery: galleryArray,
      youtube_link: formData.youtube_link,
      facebook_link: formData.facebook_link,
      update_date: formData.update_date // 💡 ບັນທຶກວັນທີອັບເດດລົງຖານຂໍ້ມູນ
    };

    try {
      if (isEditing && editId) {
        await updateDoc(doc(db, 'campaigns', editId), campaignDataToSave);
        showMessage(locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນໂຄງການສຳເລັດແລ້ວ!' : 'Campaign updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'campaigns'), {
          ...campaignDataToSave,
          raised_amount: 0,
          status: 'Active',
          created_at: new Date()
        });
        showMessage(locale === 'lo' ? 'ສ້າງໂຄງການໃໝ່ສຳເລັດແລ້ວ!' : 'New campaign created successfully!', 'success');
      }

      setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '', gallery_links: '', youtube_link: '', facebook_link: '', update_date: '' });
      setIsEditing(false);
      setEditId(null);
      fetchData();
    } catch (error) {
      showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກໂຄງການ' : 'Error saving campaign', 'error');
    }
    setLoadingCampaign(false);
  };

  const handleEditClick = (campaign: any) => {
    const galleryString = campaign.gallery && Array.isArray(campaign.gallery) ? campaign.gallery.join(', ') : '';

    setFormData({
      title_lo: campaign.title_lo || '',
      title_en: campaign.title_en || '',
      description_lo: campaign.description_lo || '',
      description_en: campaign.description_en || '',
      target_amount: campaign.target_amount ? campaign.target_amount.toString() : '',
      cover_image: campaign.cover_image || '',
      gallery_links: galleryString,
      youtube_link: campaign.youtube_link || '',
      facebook_link: campaign.facebook_link || '',
      update_date: campaign.update_date || '' // 💡 ດຶງວັນທີອັບເດດມາສະແດງຕອນກົດແກ້ໄຂ
    });
    setIsEditing(true);
    setEditId(campaign.id);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ title_lo: '', title_en: '', description_lo: '', description_en: '', target_amount: '', cover_image: '', gallery_links: '', youtube_link: '', facebook_link: '', update_date: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleDeleteClick = async (id: string) => {
    const confirmMsg = locale === 'lo'
      ? 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໂຄງການນີ້? ຂໍ້ມູນຈະຖືກລຶບຖາວອນ!'
      : 'Are you sure you want to delete this campaign? This action cannot be undone!';

    if (confirm(confirmMsg)) {
      try {
        await deleteDoc(doc(db, 'campaigns', id));
        showMessage(locale === 'lo' ? 'ລຶບໂຄງການສຳເລັດແລ້ວ!' : 'Campaign deleted successfully!', 'success');
        fetchData();
      } catch (error) {
        showMessage(locale === 'lo' ? 'ເກີດຂໍ້ຜິດພາດໃນການລຶບ' : 'Error deleting campaign', 'error');
      }
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSettings({ ...pageSettings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" /><path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" /></svg>
          <h2 className="text-2xl font-black text-gray-900">
            {locale === 'lo' ? 'ຕັ້ງຄ່າຂໍ້ຄວາມໜ້າໂຄງການ (Page Header)' : 'Campaign Page Settings (Header)'}
          </h2>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ (ພາສາລາວ)' : 'Title (Lao)'}</label>
              <input type="text" name="header_title_lo" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={pageSettings.header_title_lo} onChange={handleSettingsChange} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຫົວຂໍ້ (ພາສາອັງກິດ)' : 'Title (English)'}</label>
              <input type="text" name="header_title_en" required className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={pageSettings.header_title_en} onChange={handleSettingsChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຄຳອະທິບາຍ (ພາສາລາວ)' : 'Description (Lao)'}</label>
              <textarea name="header_subtitle_lo" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={pageSettings.header_subtitle_lo} onChange={handleSettingsChange}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຄຳອະທິບາຍ (ພາສາອັງກິດ)' : 'Description (English)'}</label>
              <textarea name="header_subtitle_en" required rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={pageSettings.header_subtitle_en} onChange={handleSettingsChange}></textarea>
            </div>
          </div>
          <button type="submit" disabled={loadingSettings} className="bg-gray-900 hover:bg-gray-800 text-white font-black py-3 px-8 rounded-xl transition-all shadow-md disabled:bg-gray-400">
            {loadingSettings
              ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...')
              : (locale === 'lo' ? 'ບັນທຶກ Header' : 'Save Header Settings')
            }
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00-.479 4.024m-18.068 4.253l2.8-.7a8.25 8.25 0 015.58.652l.108.054a9.75 9.75 0 006.725.738l1.838-.46V10.5a.75.75 0 01-.75.75h-.02a9.75 9.75 0 01-6.725-.738l-.108-.054a8.25 8.25 0 00-5.58-.652l-2.8.7V21a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" /></svg>
          <h2 className="text-2xl font-black text-gray-900">
            {isEditing
              ? (locale === 'lo' ? 'ແກ້ໄຂຂໍ້ມູນໂຄງການ (Edit Campaign)' : 'Edit Campaign')
              : (locale === 'lo' ? 'ສ້າງໂຄງການໃໝ່ (Create Campaign)' : 'Create New Campaign')
            }
          </h2>
        </div>

        <form onSubmit={handleSaveCampaign} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຊື່ໂຄງການ (ລາວ)' : 'Campaign Name (Lao)'}</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_lo} onChange={(e) => setFormData({ ...formData, title_lo: e.target.value })} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຊື່ໂຄງການ (ອັງກິດ)' : 'Campaign Name (English)'}</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ລາຍລະອຽດ (ລາວ)' : 'Description (Lao)'}</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.description_lo} onChange={(e) => setFormData({ ...formData, description_lo: e.target.value })}></textarea>
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ລາຍລະອຽດ (ອັງກິດ)' : 'Description (English)'}</label>
              <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium resize-none" value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}></textarea>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ຍອດເງິນເປົ້າໝາຍ (ກີບ)' : 'Target Amount (LAK)'}</label>
              <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="10000000" value={formData.target_amount} onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ລິ້ງຮູບໜ້າປົກ (Cover Image URL)' : 'Cover Image URL'}</label>
              <input type="url" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-600 text-gray-900 font-medium" placeholder="https://..." value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} />
            </div>
          </div>

          <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-6">
            <h3 className="font-bold text-blue-900 text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" /><path d="M10 14v-4l4 2-4 2z" /></svg>
              {locale === 'lo' ? 'ຂໍ້ມູນເພີ່ມເຕີມ & ການອັບເດດ (ທາງເລືອກ)' : 'Additional Media & Updates (Optional)'}
            </h3>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm">
                {locale === 'lo' ? 'ຮູບພາບເພີ່ມເຕີມ (Gallery)' : 'Additional Images (Gallery)'} <span className="text-gray-400 font-normal ml-1">({locale === 'lo' ? 'ຖ້າມີຫຼາຍຮູບໃຫ້ໃຊ້ໝາຍຈຸດ , ຂັ້ນກາງ' : 'Separate multiple URLs with commas'})</span>
              </label>
              <textarea rows={3} className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm resize-none" placeholder="https://img1.jpg, https://img2.png" value={formData.gallery_links} onChange={(e) => setFormData({ ...formData, gallery_links: e.target.value })}></textarea>
            </div>

            {/* 💡 ສ່ວນໃໝ່: ຂີດເສັ້ນແບ່ງ ແລະ ເພີ່ມວັນທີອັບເດດ */}
            <div className="border-t border-blue-200 pt-6 mt-4">
              <h4 className="font-bold text-blue-800 mb-4">{locale === 'lo' ? '🔄 ບັນທຶກການອັບເດດໂຄງການ' : '🔄 Campaign Updates Log'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ວັນທີອັບເດດລ່າສຸດ' : 'Update Date'}</label>
                  <input type="date" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" value={formData.update_date} onChange={(e) => setFormData({ ...formData, update_date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ລິ້ງວິດີໂອ YouTube' : 'YouTube Video Link'}</label>
                  <input type="url" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" placeholder="https://youtube.com/watch?v=..." value={formData.youtube_link} onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">{locale === 'lo' ? 'ລິ້ງ Facebook (ໂພສຕ໌ ຫຼື ເພຈ)' : 'Facebook Link'}</label>
                  <input type="url" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm" placeholder="https://facebook.com/..." value={formData.facebook_link} onChange={(e) => setFormData({ ...formData, facebook_link: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={loadingCampaign} className="flex-1 bg-teal-600 text-white font-black py-4 rounded-xl hover:bg-teal-700 transition-all shadow-md uppercase tracking-wide disabled:bg-gray-400">
              {loadingCampaign
                ? (locale === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...')
                : (isEditing
                  ? (locale === 'lo' ? 'ບັນທຶກການແກ້ໄຂ' : 'Save Changes')
                  : (locale === 'lo' ? 'ສ້າງ ແລະ ເຜີຍແຜ່' : 'Create & Publish')
                )
              }
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-bold py-4 rounded-xl transition-all shadow-sm uppercase tracking-wide">
                {locale === 'lo' ? 'ຍົກເລີກ (Cancel)' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M2.25 4.125c0-1.036.84-1.875 1.875-1.875h15.75c1.036 0 1.875.84 1.875 1.875V17.25c0 1.035-.84 1.875-1.875 1.875h-11.25l-4.5 4.5V4.125z" clipRule="evenodd" /></svg>
          {locale === 'lo' ? 'ລາຍການໂຄງການທັງໝົດ' : 'All Campaigns'}
        </h2>

        {campaignsList.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-xl">
            {locale === 'lo' ? 'ຍັງບໍ່ມີໂຄງການໃນລະບົບ.' : 'No campaigns available.'}
          </p>
        ) : (
          <div className="space-y-4">
            {campaignsList.map((campaign) => (
              <div key={campaign.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 gap-4 transition-colors">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={campaign.cover_image} alt="cover" className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{locale === 'lo' ? campaign.title_lo : campaign.title_en}</h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {locale === 'lo' ? 'ເປົ້າໝາຍ:' : 'Target:'} {Number(campaign.target_amount).toLocaleString()} LAK
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                  <button onClick={() => handleEditClick(campaign)} className="flex-1 md:flex-none text-teal-600 hover:text-white font-bold text-sm bg-teal-50 hover:bg-teal-600 px-5 py-2.5 rounded-lg transition-colors border border-teal-100 hover:border-teal-600">
                    {locale === 'lo' ? 'ແກ້ໄຂ' : 'Edit'}
                  </button>
                  <button onClick={() => handleDeleteClick(campaign.id)} className="flex-1 md:flex-none text-pink-500 hover:text-white font-bold text-sm bg-pink-50 hover:bg-pink-500 px-5 py-2.5 rounded-lg transition-colors border border-pink-100 hover:border-pink-500">
                    {locale === 'lo' ? 'ລຶບ' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}