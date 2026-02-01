import { Search, FileText, BarChart2, Users, AlertCircle, Home, Layout } from 'lucide-react';

const Dashboard = ({ children }) => {
    return (
        <div className="space-y-6">

            {/* Top Section: Banner & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Banner: 복지 통계 리포트 */}
                <div className="lg:col-span-1 bg-gradient-to-br from-accent to-accent-dark rounded-xl shadow-lg p-6 text-white flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="z-10 relative">
                        <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                            <FileText size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-1">복지 통계 리포트</h2>
                        <p className="text-primary-100 text-sm opacity-90">한눈에 보는 대한민국 복지 현황</p>
                    </div>
                    <div className="z-10 relative mt-8">
                        <button className="flex items-center gap-2 bg-white text-accent font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                            <span className="w-6 h-6 rounded-full bg-primary-50 text-accent flex items-center justify-center font-bold">→</span>
                            복지 포털 바로가기
                        </button>
                    </div>
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                </div>

                {/* Dashboard: 주요 통계 현황 (Donut Chart Mock) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <BarChart2 size={18} className="text-slate-400" />
                            주요 통계 현황 <span className="text-xs font-normal text-slate-400">[기준월: 2025년 5월]</span>
                        </h3>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Donut Chart Visual Mock */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="150 251" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="70 251" strokeDashoffset="-150" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="30 251" strokeDashoffset="-220" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-slate-500">복지대상자</span>
                            </div>
                        </div>

                        {/* Notice & QnA Tabs */}
                        <div className="flex-1 w-full">
                            <div className="flex border-b border-slate-200 mb-4">
                                <button className="px-4 py-2 text-sm font-bold text-slate-800 border-b-2 border-slate-800">공지사항</button>
                                <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-600">Q&A</button>
                                <button className="px-4 py-2 text-sm text-slate-400 hover:text-slate-600">매뉴얼</button>
                            </div>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex justify-between items-center hover:text-primary cursor-pointer w-full">
                                    <span className="truncate pr-4">• 시스템이 새단장 되었습니다.</span>
                                    <span className="text-slate-400 text-xs whitespace-nowrap">2025-05-12</span>
                                </li>
                                <li className="flex justify-between items-center hover:text-primary cursor-pointer w-full">
                                    <span className="truncate pr-4">• 5월 정기 점검 안내</span>
                                    <span className="text-slate-400 text-xs whitespace-nowrap">2025-05-10</span>
                                </li>
                                <li className="flex justify-between items-center hover:text-primary cursor-pointer w-full">
                                    <span className="truncate pr-4">• 개인정보 처리방침 변경 안내</span>
                                    <span className="text-slate-400 text-xs whitespace-nowrap">2025-05-01</span>
                                </li>
                            </ul>
                            <div className="mt-4 flex gap-2">
                                <div className="flex-1 bg-blue-50 rounded px-3 py-2 flex justify-between items-center">
                                    <span className="text-xs text-blue-600 font-bold">개인정보 승인건수</span>
                                    <span className="text-lg font-bold text-blue-700 font-number">2 <span className="text-sm font-normal">건</span></span>
                                </div>
                                <div className="flex-1 bg-orange-50 rounded px-3 py-2 flex justify-between items-center">
                                    <span className="text-xs text-orange-600 font-bold">통계요청 TODO</span>
                                    <span className="text-lg font-bold text-orange-700 font-number">1 <span className="text-sm font-normal">건</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Section: OLAP 업무정형통계 (Icon Cards) */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Layout size={18} className="text-slate-400" />
                        OLAP 업무정형통계
                    </h3>
                    <button className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50">전체보기</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: '기초생활보장', icon: <Home size={20} /> },
                        { label: '장애인복지', icon: <Users size={20} /> },
                        { label: '긴급복지', icon: <AlertCircle size={20} /> },
                        { label: '시설법인', icon: <Layout size={20} /> },
                        { label: '아동청소년', icon: <Users size={20} /> },
                        { label: '한부모가족', icon: <Users size={20} /> },
                    ].map((item, idx) => (
                        <button key={idx} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all group border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white text-slate-400 group-hover:text-primary group-hover:bg-blue-50 flex items-center justify-center mb-3 shadow-sm border border-slate-100 transition-colors">
                                {item.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Report Lists & Region Analysis Area */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <Search size={18} className="text-slate-400" />
                    지역 현황 분석 및 리포트 생성
                </h3>

                {/* Embedded Main Feature */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
