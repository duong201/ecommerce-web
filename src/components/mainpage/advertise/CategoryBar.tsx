import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useFetch } from '../../../common/hooks/useFetch'
import { categoryService } from '../../../services'
import { Skeleton } from '../../../common/components/ui'
import type { Category } from '../../../interface'

const CategoryBar = () => {
  const { t } = useTranslation()
  const fetchTree = useCallback(() => categoryService.tree(true), [])
  const { data: tree, loading } = useFetch<Category[]>(fetchTree, [], [])

  return (
    <nav className="category-bar" aria-label={t('home.categoriesAria')}>
      <h2 className="category-bar__title">{t('home.shopByCategory')}</h2>

      <div className="category-bar__scroller">
        <ul className="category-bar__list">
          {loading &&
            Array.from({ length: 6 }, (_, index) => (
              <li key={index} className="category-bar__skeleton">
                <Skeleton height={4.4} radius="2.2rem" />
              </li>
            ))}

          {!loading && (
            <li>
              <Link to="/san-pham" className="category-bar__chip category-bar__chip--all">
                {t('home.allFruit')}
              </Link>
            </li>
          )}

          {!loading &&
            tree.map((root) => (
              <React.Fragment key={root.id}>
                <li>
                  <Link
                    to={`/san-pham?categoryId=${root.id}`}
                    className="category-bar__chip category-bar__chip--root"
                  >
                    {root.imageUrl && (
                      <img src={root.imageUrl} alt="" loading="lazy" aria-hidden="true" />
                    )}
                    {root.name}
                  </Link>
                </li>

                {(root.children ?? []).map((child) => (
                  <li key={child.id}>
                    <Link
                      to={`/san-pham?categoryId=${child.id}`}
                      className="category-bar__chip category-bar__chip--child"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </React.Fragment>
            ))}
        </ul>
      </div>
    </nav>
  )
}

export default CategoryBar
