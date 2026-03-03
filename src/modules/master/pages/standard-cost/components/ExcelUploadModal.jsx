import React, { useState } from 'react';
import { Modal, Upload, Button, Table, message, Alert } from 'antd';
import { InboxOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export function ExcelUploadModal({ open, onClose, onUpload }) {
    const [fileList, setFileList] = useState([]);
    const [previewData, setPreviewData] = useState([]);

    const handleFileChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1); // Only keep last file
        setFileList(newFileList);

        if (info.file.status === 'done' || info.file.originFileObj) {
            // Mock Parsing logic simulation
            // In real app, read XLSX file here.
            simulateParsing();
        }
    };

    const simulateParsing = () => {
        // Create mock preview data
        const mockPreview = [
            {
                key: 1,
                project: '2026 상반기',
                partNo: 'NEW-001',
                name: '신규 비데',
                factoryPrice: 120000,
                error: null
            },
            {
                key: 2,
                project: '2026 상반기',
                partNo: 'NEW-002',
                name: '신규 수전',
                factoryPrice: 45000,
                error: null
            },
            {
                key: 3,
                project: 'Unknown',
                partNo: 'ERR-999',
                name: '오류 데이터 예시',
                factoryPrice: 0,
                error: '필수값 누락: 공장도가'
            },
        ];
        setPreviewData(mockPreview);
        message.success('파일을 성공적으로 읽었습니다.');
    };

    const handleUploadConfirm = () => {
        const validData = previewData.filter(d => !d.error).map(d => ({
            project: d.project,
            type: 'OEM', // Default
            partNo: d.partNo,
            name: d.name,
            factoryPrice: d.factoryPrice,
            weight: 0,
            logisticsCost: 0,
            otherRate: 0,
            marginRate: 0,
        }));

        if (validData.length === 0) {
            message.error('업로드할 유효한 데이터가 없습니다.');
            return;
        }

        onUpload(validData);
        setFileList([]);
        setPreviewData([]);
    };

    const columns = [
        { title: '프로젝트', dataIndex: 'project' },
        { title: '품번', dataIndex: 'partNo' },
        { title: '품명', dataIndex: 'name' },
        { title: '공장도가', dataIndex: 'factoryPrice', align: 'right', render: v => v.toLocaleString() },
        {
            title: '검증결과',
            dataIndex: 'error',
            width: 180,
            render: err => err ? <span style={{ color: '#ff4d4f' }}>{err}</span> : <span style={{ color: '#52c41a' }}>성공</span>
        }
    ];

    const hasError = previewData.some(d => !!d.error);

    return (
        <Modal
            title="표준원가 엑셀 일괄 등록"
            open={open}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose}>취소</Button>,
                <Button
                    key="upload"
                    type="primary"
                    onClick={handleUploadConfirm}
                    disabled={previewData.length === 0 || hasError}
                >
                    일괄 등록 ({previewData.filter(d => !d.error).length}건)
                </Button>
            ]}
        >
            <div style={{ marginBottom: 16 }}>
                <Button icon={<FileExcelOutlined />}>업로드 양식 다운로드</Button>
            </div>

            <Dragger
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Manual upload
                maxCount={1}
                accept=".xlsx, .xls"
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">엑셀 파일을 이곳으로 드래그하거나 클릭하여 업로드하세요.</p>
            </Dragger>

            {previewData.length > 0 && (
                <div style={{ marginTop: 24 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>업로드 미리보기</div>
                    {hasError && <Alert message="오류가 있는 행은 등록되지 않습니다." type="error" showIcon style={{ marginBottom: 8 }} />}
                    <Table
                        dataSource={previewData}
                        columns={columns}
                        size="small"
                        pagination={false}
                        scroll={{ y: 200 }}
                    />
                </div>
            )}
        </Modal>
    );
}
