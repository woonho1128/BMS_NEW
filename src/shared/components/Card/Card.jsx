import React from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Card.module.css';

/**
 * ERP 표준 Card - 대시보드·업무 화면 공통 기준 컴포넌트
 * @param {{
 *   title?: string;
 *   indicatorColor?: 'primary' | 'warning' | 'danger' | 'neutral';
 *   hoverable?: boolean;
 *   clickable?: boolean;
 *   onClick?: () => void;
 *   variant?: 'default' | 'highlight';
 *   actions?: React.ReactNode;
 *   className?: string;
 *   children?: React.ReactNode;
 * }} props
 */
export function Card({
  title,
  indicatorColor,
  hoverable = false,
  clickable = false,
  onClick,
  variant = 'default',
  actions,
  className,
  children,
}) {
  const hasHeader = typeof title === 'string' && title.length > 0;

  const cardClassName = classnames(
    styles.card,
    hoverable && styles.hoverable,
    clickable && styles.clickable,
    variant === 'highlight' && styles.highlight,
    className
  );

  const sharedProps = {
    className: cardClassName,
    ...(clickable && {
      role: 'button',
      tabIndex: 0,
      onClick,
      onKeyDown: (e) => e.key === 'Enter' && onClick?.(),
    }),
  };

  if (hasHeader) {
    return (
      <div {...sharedProps}>
        <header className={styles.header}>
          <div className={styles.titleWrap}>
            {indicatorColor && (
              <span
                className={classnames(styles.indicator, styles[indicatorColor])}
                aria-hidden
              />
            )}
            <h2 className={styles.title}>{title}</h2>
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    );
  }

  return <div {...sharedProps}>{children}</div>;
}

/**
 * Card 내부 헤더 (구성용)
 */
export function CardHeader({ children, className, noBorder }) {
  return (
    <header
      className={classnames(styles.header, noBorder && styles.headerNoBorder, className)}
    >
      {children}
    </header>
  );
}

/**
 * Card 내부 타이틀 (구성용). indicatorColor 시 타이틀 왼쪽에 3~4px bar
 */
export function CardTitle({ indicatorColor, children, className }) {
  return (
    <div className={classnames(styles.titleWrap, className)}>
      {indicatorColor && (
        <span
          className={classnames(styles.indicator, styles[indicatorColor])}
          aria-hidden
        />
      )}
      <h2 className={styles.title}>{children}</h2>
    </div>
  );
}

/**
 * Card 헤더 오른쪽 액션 (구성용)
 */
export function CardActions({ children, className }) {
  return <div className={classnames(styles.actions, className)}>{children}</div>;
}

/**
 * Card 본문
 */
export function CardBody({ children, className, tight }) {
  return (
    <div
      className={classnames(
        styles.body,
        tight && styles.bodyTight,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Card 푸터 (더보기, 상세보기 등 CTA)
 */
export function CardFooter({ children, className }) {
  return <footer className={classnames(styles.footer, className)}>{children}</footer>;
}
