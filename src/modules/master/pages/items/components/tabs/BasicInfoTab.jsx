import React from 'react';
import { Input, Select, InputNumber } from 'antd';


const { TextArea } = Input;

export function BasicInfoTab({ data, onChange }) {
    return (
        <div>
            <div className="tab-inner-section">
                <span className="section-label">기본 정보</span>
                <div className="form-grid-2col">
                    <FormItem label="품목명 (필수)">
                        <Input
                            value={data.name}
                            onChange={e => onChange('name', e.target.value)}
                            placeholder="품목명을 입력하세요"
                        />
                    </FormItem>
                    <FormItem label="모델명">
                        <Input
                            value={data.model}
                            onChange={e => onChange('model', e.target.value)}
                            placeholder="모델명을 입력하세요"
                        />
                    </FormItem>
                    <FormItem label="브랜드">
                        <Select
                            value={data.brand}
                            onChange={val => onChange('brand', val)}
                            options={[
                                { value: '대림테크', label: '대림테크' },
                                { value: '워터웍스', label: '워터웍스' },
                                { value: '스마트바스', label: '스마트바스' },
                            ]}
                        />
                    </FormItem>
                    <FormItem label="카테고리">
                        <Select
                            value={data.category}
                            onChange={val => onChange('category', val)}
                            options={[
                                { value: '위생도기', label: '위생도기' },
                                { value: '세면기', label: '세면기' },
                                { value: '수전', label: '수전' },
                                { value: '악세사리', label: '악세사리' },
                            ]}
                        />
                    </FormItem>
                    <FormItem label="판매 상태">
                        <Select
                            value={data.status}
                            onChange={val => onChange('status', val)}
                            options={[
                                { value: 'ACTIVE', label: '판매중' },
                                { value: 'INACTIVE', label: '판매중지' },
                                { value: 'ERP_PENDING', label: 'ERP연동대기' },
                            ]}
                        />
                    </FormItem>
                </div>
            </div>

            <div className="tab-inner-section">
                <span className="section-label">가격 정보</span>
                <div className="form-grid-2col">
                    <FormItem label="기본 공급가 (VAT 별도)">
                        <InputNumber
                            value={data.basePrice}
                            onChange={val => onChange('basePrice', val)}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </FormItem>
                    <FormItem label="기본 소비자가 (참고용)">
                        <InputNumber
                            value={data.baseRetailPrice}
                            onChange={val => onChange('baseRetailPrice', val)}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            style={{ width: '100%' }}
                        />
                    </FormItem>
                </div>
            </div>

            <div className="tab-inner-section">
                <span className="section-label">상세 설명</span>
                <FormItem label="내부용 메모 / 간단 설명">
                    <TextArea
                        rows={4}
                        value={data.description}
                        onChange={e => onChange('description', e.target.value)}
                    />
                </FormItem>
            </div>
        </div>
    );
}

function FormItem({ label, children }) {
    return (
        <div className="form-item">
            <label>{label}</label>
            {children}
        </div>
    );
}
