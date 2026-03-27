/**
 * 납품 계획 관리 앱 (Restored & Modularized)
 * 기존 src/App.jsx 의 로직을 기반으로 재구성되었습니다.
 */
import React, { useMemo, useState } from 'react';
import './DeliveryPlanApp.css';

// --- Placeholders for deleted components ---
const Header = ({ title, userName }) => (
    <div style={{ background: '#1A4B84', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h1>
        <div>{userName} 님</div>
    </div>
);

const TabNavigation = ({ activeTab, onChange }) => (
    <div style={{ display: 'flex', borderBottom: '1px solid #dce4ef', background: 'white' }}>
        {['site', 'item', 'history', 'settings'].map(tab => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === tab ? '3px solid #1A4B84' : 'none',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    cursor: 'pointer'
                }}
            >
                {tab === 'site' && '현장 관리'}
                {tab === 'item' && '품목 관리'}
                {tab === 'history' && '변경 이력'}
                {tab === 'settings' && '환경 설정'}
            </button>
        ))}
    </div>
);

const SiteManagementPage = () => <div style={{ padding: '2rem' }}><h2>현장 관리</h2><p>기능 복구 중...</p></div>;
const ItemManagementPage = () => <div style={{ padding: '2rem' }}><h2>품목 관리</h2><p>기능 복구 중...</p></div>;
const HistoryPage = () => <div style={{ padding: '2rem' }}><h2>변경 이력</h2><p>기능 복구 중...</p></div>;
const SettingsPage = () => <div style={{ padding: '2rem' }}><h2>환경 설정</h2><p>기능 복구 중...</p></div>;

const AddSiteModal = () => null;
const AddItemModal = () => null;
const DeliveryInputModal = () => null;
const StatusChangeModal = () => null;
const DetailModal = () => null;

// --- Mock Data ---
const STATUS = { PLANNED: '예정', IN_PROGRESS: '진행중', DONE: '완료', DELAYED: '지연' };
const STATUS_LIST = ['예정', '진행중', '완료', '지연'];
const STATUS_META = {
    '예정': { color: '#3498db', icon: '⏳' },
    '진행중': { color: '#f39c12', icon: '🔄' },
    '완료': { color: '#27ae60', icon: '✅' },
    '지연': { color: '#e74c3c', icon: '⚠️' },
};

export default function DeliveryPlanApp({ currentUserName = '홍길동', user }) {
    const [activeTab, setActiveTab] = useState('site');
    const [sites, setSites] = useState([]);
    const [items, setItems] = useState([]);

    return (
        <div className="dpmApp" style={{ background: '#f4f7fb', minHeight: '100vh' }}>
            <Header title="📦 납품 계획 관리 시스템" userName={currentUserName} />
            <div className="dpmMain">
                <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

                {activeTab === 'site' ? <SiteManagementPage /> :
                    activeTab === 'item' ? <ItemManagementPage /> :
                        activeTab === 'history' ? <HistoryPage /> :
                            <SettingsPage />}
            </div>

            {/* Modals placeholders */}
            <AddSiteModal />
            <AddItemModal />
            <DeliveryInputModal />
            <StatusChangeModal />
            <DetailModal />
        </div>
    );
}
