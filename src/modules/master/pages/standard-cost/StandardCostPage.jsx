import React, { useState } from 'react';
import { Button, Input, Select, message, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../../shared/components/PageShell/PageShell';
import { CostList } from './components/CostList';
import { CostDetailPanel } from './components/CostDetailPanel';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { MOCK_COSTS } from './mockCostData';
import './StandardCostPage.css';

export function StandardCostPage() {
    const [costs, setCosts] = useState(MOCK_COSTS);
    const [selectedId, setSelectedId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    // Filter States
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const handleSelectRow = (id) => {
        setSelectedId(id);
        setIsCreating(false);
    };

    const handleCreateNew = () => {
        setSelectedId(null);
        setIsCreating(true);
    };

    const handleSave = (itemData) => {
        if (itemData.id) {
            // Update
            setCosts(prev => prev.map(c => c.id === itemData.id ? { ...itemData, modifyDate: new Date().toISOString().split('T')[0] } : c));
            message.success('저장되었습니다.');
        } else {
            // Create
            const newId = Math.max(...costs.map(c => c.id), 0) + 1;
            const newItem = {
                ...itemData,
                id: newId,
                status: 'REQUEST',
                modifyDate: new Date().toISOString().split('T')[0],
                history: []
            };
            setCosts(prev => [newItem, ...prev]);
            setSelectedId(newId);
            setIsCreating(false);
            message.success('신규 등록되었습니다.');
        }
    };

    const handleExcelUpload = (newItems) => {
        // Mock integration
        const nextIdStart = Math.max(...costs.map(c => c.id), 0) + 1;
        const itemsWithIds = newItems.map((item, idx) => ({
            ...item,
            id: nextIdStart + idx,
            status: 'REQUEST',
            modifyDate: new Date().toISOString().split('T')[0],
            history: [{ date: new Date().toISOString().split('T')[0], user: 'System', field: 'ExcelUpload', prev: '-', next: 'Batch' }]
        }));
        setCosts(prev => [...itemsWithIds, ...prev]);
        setIsExcelModalOpen(false);
        message.success(`${newItems.length}건이 일괄 등록되었습니다.`);
    };

    const selectedItem = isCreating
        ? { id: null, project: '', type: 'OEM', partNo: '', name: '', factoryPrice: 0, weight: 0, logisticsCost: 0, otherRate: 0, marginRate: 0, status: 'REQUEST', revisionType: 'REGULAR', history: [] }
        : costs.find(c => c.id === selectedId);

    const filteredCosts = costs.filter(c => {
        const matchesSearch = c.name.includes(searchText) || c.partNo.includes(searchText);
        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <PageShell title="표준원가 관리" path="/master/standard-cost">
            <div className="std-cost-container">
                {/* Top Filter Bar */}
                <div className="std-cost-filter-bar">
                    <div className="filter-group">
                        <Select defaultValue="2026" style={{ width: 100 }} options={[{ value: '2026', label: '2026년' }]} />
                        <Select defaultValue="ALL" style={{ width: 150 }} options={[{ value: 'ALL', label: '전체 프로젝트' }]} />
                        <Select
                            defaultValue="ALL"
                            style={{ width: 120 }}
                            onChange={setStatusFilter}
                            options={[
                                { value: 'ALL', label: '전체 상태' },
                                { value: 'REQUEST', label: '요청' },
                                { value: 'FACTORY_DONE', label: '공장입력완료' },
                                { value: 'PROJECT_CONFIRMED', label: '프로젝트확인' },
                                { value: 'PLANNING_APPROVED', label: '기획확정' },
                                { value: 'ERP_REFLECTED', label: 'ERP반영완료' },
                            ]}
                        />
                        <Input
                            placeholder="품번/품명 검색"
                            prefix={<SearchOutlined />}
                            style={{ width: 200 }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="action-group">
                        <Button icon={<UploadOutlined />} onClick={() => setIsExcelModalOpen(true)}>엑셀 업로드</Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>단건 등록</Button>
                    </div>
                </div>

                {/* Split View */}
                <div className="std-cost-split">
                    <div className="split-left">
                        <CostList costs={filteredCosts} selectedId={selectedId} onSelect={handleSelectRow} />
                    </div>
                    <div className="split-right">
                        {(selectedId || isCreating) ? (
                            <CostDetailPanel
                                key={selectedId || 'new'}
                                initialData={selectedItem}
                                onSave={handleSave}
                                isCreating={isCreating}
                            />
                        ) : (
                            <div className="empty-placeholder">
                                좌측 목록에서 항목을 선택하거나<br />[단건 등록]을 진행해주세요.
                            </div>
                        )}
                    </div>
                </div>

                <ExcelUploadModal
                    open={isExcelModalOpen}
                    onClose={() => setIsExcelModalOpen(false)}
                    onUpload={handleExcelUpload}
                />
            </div>
        </PageShell>
    );
}
