'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

// 💡 ຮັບຄ່າ id ແລະ locale ແບບກົງໆ ບໍ່ຜ່ານ Promise
export default function CampaignClient({ id, locale }: { id: string, locale: string }) {
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] = useState<string>('');

    const [showAllDonorsModal, setShowAllDonorsModal] = useState(false);
    const [allDonors, setAllDonors] = useState<any[]>([]);
    const [realRaisedAmount, setRealRaisedAmount] = useState(0);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchCampaignData = async () => {
            try {
                const docRef = doc(db, "campaigns", id);
                const docSnap = await getDoc(docRef);
                let campData: any = null;
                if (docSnap.exists()) {
                    campData = { id: docSnap.id, ...docSnap.data() };
                    setCampaign(campData);
                    setActiveImage(campData.cover_image);
                }

                if (campData) {
                    const qDonations = query(
                        collection(db, 'donations'),
                        where('campaign_id', '==', id),
                        where('status', '==', 'Approved')
                    );
                    const donSnap = await getDocs(qDonations);
                    const donorsList = donSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

                    donorsList.sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
                    setAllDonors(donorsList);

                    const total = donorsList.reduce((sum: number, donor: any) => sum + (Number(donor.amount) || 0), 0);
                    setRealRaisedAmount(total);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaignData();
    }, [id]);

    const handleViewAllDonors = () => {
        setShowAllDonorsModal(true);
    };

    if (!id) return <div className="p-10 text-center text-gray-400">ກະລຸນາເລືອກໂຄງການເພື່ອສະແດງຜົນ</div>;
    if (loading) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-teal-600 bg-white">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>;
    if (!campaign) return <div className="min-h-screen flex justify-center items-center font-bold text-xl text-gray-500 bg-white">ບໍ່ພົບຂໍ້ມູນໂຄງການນີ້</div>;

    const percent = Math.min(Math.round((realRaisedAmount / campaign.target_amount) * 100), 100) || 0;

    return (
        <div className="bg-white min-h-screen pb-24 font-sans relative">

            <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-16">
                <Link href={`/${locale}/campaigns`} className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm mb-6 hover:text-teal-700 transition-all uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {locale === 'lo' ? 'ກັບຄືນໜ້າໂຄງການ' : 'BACK TO PROJECTS'}
                </Link>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight max-w-4xl">
                    {locale === 'lo' ? campaign.title_lo : campaign.title_en}
                </h1>
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    <div className="lg:col-span-8 space-y-10">

                        <div className="space-y-4">
                            <div className="w-full bg-gray-50 rounded-4xl overflow-hidden shadow-md border border-gray-100 flex items-center justify-center p-2 h-[300px] sm:h-[450px]">
                                <img
                                    src={activeImage}
                                    alt="cover"
                                    className="w-full h-full object-contain rounded-3xl transition-all duration-300"
                                />
                            </div>

                            {(campaign.gallery && campaign.gallery.length > 0) && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    <button onClick={() => setActiveImage(campaign.cover_image)} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === campaign.cover_image ? 'border-teal-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                        <img src={campaign.cover_image} className="w-full h-full object-cover" alt="thumbnail" />
                                    </button>
                                    {campaign.gallery.map((img: string, index: number) => (
                                        <button key={index} onClick={() => setActiveImage(img)} className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === img ? 'border-teal-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                            <img src={img} className="w-full h-full object-cover" alt={`thumbnail ${index}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-teal-500 rounded-full"></span>
                                {locale === 'lo' ? 'ກ່ຽວກັບໂຄງການນີ້' : 'ABOUT THIS CAMPAIGN'}
                            </h3>
                            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-600">
                                {locale === 'lo' ? campaign.description_lo : campaign.description_en}
                            </p>
                        </div>

                        {(campaign.updates && campaign.updates.length > 0) && (
                            <div className="pt-10 mt-10 border-t border-gray-100 space-y-8">
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8">
                                    <span className="w-1.5 h-8 bg-teal-500 rounded-full"></span>
                                    {locale === 'lo' ? 'ການເຄື່ອນໄຫວ ແລະ ຕິດຕາມໂຄງການ' : 'PROJECT UPDATES & TRACKING'}
                                </h3>

                                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {campaign.updates.map((update: any, index: number) => {
                                        const embedUrl = getYoutubeEmbedUrl(update.youtube_link);
                                        return (
                                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>

                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:border-teal-200 transition-colors">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-bold text-teal-700 bg-teal-50 px-4 py-1.5 rounded-full text-sm border border-teal-100">
                                                            {new Date(update.date).toLocaleDateString(locale === 'lo' ? 'lo-LA' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>

                                                    {embedUrl && (
                                                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-50">
                                                            <iframe
                                                                src={embedUrl}
                                                                className="w-full h-full"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            ></iframe>
                                                        </div>
                                                    )}

                                                    {update.facebook_link && (
                                                        <a
                                                            href={update.facebook_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 hover:bg-teal-600 hover:text-white font-bold py-3 px-4 rounded-xl transition-all border border-gray-200 hover:border-teal-600 text-sm"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                            {locale === 'lo' ? 'ເບິ່ງລາຍລະອຽດໃນ Facebook' : 'View on Facebook'}
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-teal-900/10 border border-teal-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 space-y-8">

                                {/* 💡 ແກ້ໄຂສີເປີເຊັນເປັນສີດຳ */}
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="flex flex-col">
                                            {/* ປ່ຽນ text-teal-600 ເປັນ text-gray-900 */}
                                            <span className="text-gray-900 font-black text-5xl tracking-tighter">{percent}%</span>
                                            <span className="text-gray-400 font-bold text-xs md:text-sm uppercase tracking-wider mt-1">
                                                {locale === 'lo' ? 'ສຳເລັດແລ້ວ' : 'REACHED'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                                        <div
                                            className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out shadow-inner"
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-2">

                                    {/* 💡 ແກ້ໄຂສີຍອດບໍລິຈາກປັດຈຸບັນເປັນສີ Teal */}
                                    <div className="flex flex-col">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">
                                            {locale === 'lo' ? 'ຍອດບໍລິຈາກປັດຈຸບັນ' : 'CURRENTLY RAISED'}
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            {/* ປ່ຽນເປັນ text-teal-600 */}
                                            <span className="font-black text-teal-600 text-3xl">{Number(realRaisedAmount).toLocaleString()}</span>
                                            <span className="text-teal-600 font-bold text-sm">LAK</span>
                                        </div>
                                    </div>

                                    {/* 💡 ແກ້ໄຂສີເປົ້າໝາຍທັງໝົດເປັນສີບົວ (Pink) */}
                                    <div className="flex flex-col border-t border-gray-100 pt-6">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-1">
                                            {locale === 'lo' ? 'ເປົ້າໝາຍທັງໝົດ' : 'TOTAL GOAL'}
                                        </span>
                                        <div className="flex items-baseline gap-1">
                                            {/* ປ່ຽນເປັນ text-pink-500 */}
                                            <span className="font-bold text-pink-500 text-xl">{Number(campaign.target_amount).toLocaleString()}</span>
                                            <span className="text-pink-400 font-medium text-xs">LAK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-3">
                                    <Link
                                        href={`/${locale}/donate?campaignId=${campaign.id}`}
                                        className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white text-center font-black py-6 rounded-3xl transition-all shadow-xl shadow-teal-600/20 hover:-translate-y-1 active:scale-95 uppercase tracking-wider text-lg"
                                    >
                                        {locale === 'lo' ? 'ຮ່ວມບໍລິຈາກ' : 'DONATE NOW'}
                                    </Link>

                                    <button
                                        onClick={handleViewAllDonors}
                                        className="w-full py-3 bg-teal-50 text-teal-700 font-bold rounded-2xl hover:bg-teal-100 transition-all uppercase tracking-wider text-sm border border-teal-100"
                                    >
                                        {locale === 'lo' ? 'ເບິ່ງຜູ້ບໍລິຈາກທັງໝົດ' : 'VIEW ALL DONORS'}
                                    </button>
                                </div>

                                <p className="text-center text-gray-400 text-xs md:text-sm font-bold leading-relaxed px-4">
                                    {locale === 'lo'
                                        ? 'ຂໍ້ມູນການບໍລິຈາກຂອງທ່ານຈະຖືກບັນທຶກຢ່າງໂປ່ງໃສ'
                                        : 'YOUR CONTRIBUTION IS SECURE AND TRANSPARENT'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAllDonorsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">

                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-black text-gray-900">
                                {locale === 'lo' ? 'ຜູ້ສະໜັບສະໜູນທັງໝົດ' : 'ALL SUPPORTERS'}
                            </h3>
                            <button onClick={() => setShowAllDonorsModal(false)} className="text-gray-400 hover:text-teal-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {allDonors.length > 0 ? (
                                <div className="space-y-3">
                                    {allDonors.map((donor, index) => (
                                        <div key={donor.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                {!donor.hideProfile && donor.profile_url ? (
                                                    <img src={donor.profile_url} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                ) : (
                                                    <div className="w-10 h-10 flex items-center justify-center bg-teal-50 text-teal-700 rounded-full font-black text-sm">
                                                        {index + 1}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg">
                                                        {donor.hideName ? (locale === 'lo' ? 'ຜູ້ບໍ່ປະສົງອອກນາມ' : 'Anonymous') : donor.donor_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="font-black text-teal-600 text-lg">
                                                {donor.hideAmount ? (
                                                    <span className="text-sm text-gray-400 uppercase tracking-wider font-bold bg-gray-50 px-3 py-1 rounded-full">{locale === 'lo' ? 'ປິດບັງຍອດເງິນ' : 'Hidden'}</span>
                                                ) : (
                                                    <>{Number(donor.amount).toLocaleString()} <span className="text-sm font-bold text-gray-400">LAK</span></>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    </div>
                                    <p className="text-gray-500 font-medium text-lg">
                                        {locale === 'lo' ? 'ຍັງບໍ່ມີຂໍ້ມູນຜູ້ບໍລິຈາກທີ່ອະນຸມັດແລ້ວ' : 'No approved donors yet.'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {locale === 'lo' ? 'ຮ່ວມເປັນຜູ້ບໍລິຈາກຄົນທຳອິດສຳລັບໂຄງການນີ້!' : 'Be the first to donate to this campaign!'}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}