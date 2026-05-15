import { useTranslation } from 'react-i18next'
import { FuseBoxLogo } from './FuseBoxLogo'

type ILogoVariant = 'default' | 'large' | 'compact'

interface ILogoProps {
  variant: ILogoVariant
}

export default function Logo({ variant }: ILogoProps) {
  const { t } = useTranslation()

  if (variant === 'large') {
    return (
      <>
        <FuseBoxLogo size={40} tone="default" className="login-brand-mark" />
        <h1 className="login-title">Fuse Box</h1>
        <p className="login-sub">{t('topbar.brandSub')}</p>
      </>
    )
  }

  if (variant === 'compact') {
    return (
      <>
        <FuseBoxLogo size={36} tone="default" className="print-brand-mark" />
        <span className="print-brand-name">Fuse Box</span>
      </>
    )
  }

  return (
    <>
      <FuseBoxLogo size={32} plate className="brand-mark" />
      <span className="brand-name">Fuse Box</span>
      <span className="brand-sub">{t('topbar.brandSub')}</span>
    </>
  )
}
