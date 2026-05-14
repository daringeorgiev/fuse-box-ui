import { useTranslation } from 'react-i18next'

type ILogoVariant = 'default' | 'large' | 'compact'

interface ILogoProps {
  variant: ILogoVariant
}

export default function Logo({ variant }: ILogoProps) {
  const { t } = useTranslation()

  if (variant === 'large') {
    return (
      <>
        <div className="brand-mark login-brand-mark">F</div>
        <h1 className="login-title">Fuse Box</h1>
        <p className="login-sub">{t('topbar.brandSub')}</p>
      </>
    )
  }

  if (variant === 'compact') {
    return (
      <>
        <div className="print-brand-mark">F</div>
        <span className="print-brand-name">Fuse Box</span>
      </>
    )
  }

  return (
    <>
      <div className="brand-mark">F</div>
      <span className="brand-name">Fuse Box</span>
      <span className="brand-sub">{t('topbar.brandSub')}</span>
    </>
  )
}
