import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePanels } from '../hooks/usePanels'
import { useAuth } from '../context/AuthContext'
import Topbar from '../components/Topbar'

type SortKey = 'name-asc' | 'name-desc' | 'location' | 'newest' | 'oldest'

function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function PanelsPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { isAdmin } = useAuth()
  const { data: rawPanels = [], isLoading } = usePanels()
  const panels = isAdmin ? rawPanels : rawPanels.filter(p => !p.isDefault)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('name-asc')

  const hasDates = panels.some(p => p.createdAt)

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? panels.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        )
      : panels

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'name-asc':  return a.name.localeCompare(b.name)
        case 'name-desc': return b.name.localeCompare(a.name)
        case 'location':  return a.location.localeCompare(b.location)
        case 'newest':    return (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
        case 'oldest':    return (a.createdAt ?? '').localeCompare(b.createdAt ?? '')
      }
    })
  }, [panels, search, sort])

  return (
    <div className="app">
      <Topbar />
      <main className="main panels-page">
        <div className="page-header">
          <h1 className="page-title">{t('panelsPage.title')}</h1>
          <button className="btn btn-primary" onClick={() => navigate('/panels/new')}>{t('panelsPage.newPanel')}</button>
        </div>

        <div className="card">

          {isLoading && (
            <div className="panels-list-empty">{t('panelsPage.loading')}</div>
          )}

          {!isLoading && panels.length === 0 && (
            <div className="panels-list-empty">
              <span>{t('panelsPage.emptyTitle')}</span>
              <a onClick={() => navigate('/panels/new')} className="panels-empty-link" role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && navigate('/panels/new')}>{t('panelsPage.emptyAction')}</a>
            </div>
          )}

          {!isLoading && panels.length > 0 && (
            <>
              <div className="panels-toolbar">
                <input
                  className="panels-search"
                  type="search"
                  placeholder={t('panelsPage.searchPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label={t('panelsPage.searchPlaceholder')}
                />
                <div className="panels-toolbar-spacer" />
                <label className="panels-sort-label" htmlFor="panels-sort">
                  {t('panelsPage.sortBy')}
                </label>
                <select
                  id="panels-sort"
                  className="panels-sort"
                  value={sort}
                  onChange={e => setSort(e.target.value as SortKey)}
                  aria-label={t('panelsPage.sortBy')}
                >
                  <option value="name-asc">{t('panelsPage.sortNameAsc')}</option>
                  <option value="name-desc">{t('panelsPage.sortNameDesc')}</option>
                  <option value="location">{t('panelsPage.sortLocation')}</option>
                  {hasDates && <option value="newest">{t('panelsPage.sortNewest')}</option>}
                  {hasDates && <option value="oldest">{t('panelsPage.sortOldest')}</option>}
                </select>
              </div>

              <table className="panels-table">
                <thead>
                  <tr>
                    <th className="panels-th panels-th-name">{t('panelsPage.colName')}</th>
                    <th className="panels-th panels-th-loc">{t('panelsPage.colLocation')}</th>
                    {hasDates && <th className="panels-th panels-th-date">{t('panelsPage.colCreated')}</th>}
                    {hasDates && <th className="panels-th panels-th-date">{t('panelsPage.colUpdated')}</th>}
                    <th className="panels-th panels-th-actions" />
                  </tr>
                </thead>
                <tbody>
                  {displayed.length === 0 && (
                    <tr>
                      <td className="panels-list-empty" colSpan={hasDates ? 5 : 3}>
                        {t('panelsPage.noResults')}
                      </td>
                    </tr>
                  )}
                  {displayed.map(p => (
                    <tr key={p.id} className="panels-row">
                      <td className="panels-td panels-td-name" title={p.name}>{p.name}</td>
                      <td className="panels-td panels-td-loc" title={p.location || undefined}>{p.location || '—'}</td>
                      {hasDates && <td className="panels-td panels-td-date">{formatDate(p.createdAt, i18n.language)}</td>}
                      {hasDates && <td className="panels-td panels-td-date">{formatDate(p.updatedAt, i18n.language)}</td>}
                      <td className="panels-td panels-td-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/?panel=${p.id}`)}
                        >
                          {t('panelsPage.view')}
                        </button>
                        <button
                          className="btn"
                          onClick={() => navigate(`/panels/${p.id}/edit?from=panels`)}
                        >
                          {t('panelsPage.edit')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
