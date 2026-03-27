/**
 * PlaceholderPage — 미구현 페이지용 공통 임시 컴포넌트
 *
 * 사용법:
 *   <PlaceholderPage path="/some/route" />
 *   <PlaceholderPage title="페이지 제목" description="설명 텍스트" />
 *
 * @param {Object}  props
 * @param {string}  [props.path]        - 라우터 경로. 제공 시 ia.js에서 페이지 제목을 자동 조회합니다.
 * @param {string}  [props.title]       - 직접 지정할 페이지 타이틀 (path보다 우선합니다).
 * @param {string}  [props.description] - 부제목/설명 문구
 * @param {string}  [props.icon]        - 표시할 이모지 아이콘 (기본값: '🔧')
 */
import React from 'react';
import { PageShell } from '../PageShell/PageShell';
import styles from './PlaceholderPage.module.css';

export function PlaceholderPage({ path, title, description, icon = '🔧' }) {
    return (
        /*
         * PageShell: 타이틀/설명 헤더가 포함된 공통 페이지 프레임
         * - path 제공 시 ia.js에서 타이틀을 자동 탐색
         * - title 직접 전달 시 path 탐색 없이 해당 값 사용
         */
        <PageShell path={path} title={title}>
            <div className={styles.container}>
                <div className={styles.icon} aria-hidden="true">{icon}</div>
                <p className={styles.message}>해당 페이지는 현재 준비 중입니다.</p>
                {description && <p className={styles.description}>{description}</p>}
            </div>
        </PageShell>
    );
}
