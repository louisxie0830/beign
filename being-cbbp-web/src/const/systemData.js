export const entityRolesDataSource = [
  {
    key: 0,
    role: 'ADMIN',
    loginPath: '/admin/login',
    routerNameHome: 'companyList'
  },
  {
    key: 1,
    role: 'EXPORTER',
    loginPath: '/user/login',
    routerNameHome: 'dashboard'
  },
  {
    key: 2,
    role: 'IMPORTER',
    loginPath: '/user/login_importer',
    routerNameHome: 'dashboard'
  },
  {
    key: 3,
    role: 'CUSTOMS_BROKER',
    loginPath: '/user/login_cb',
    routerNameHome: 'dashboard'
  },
  {
    key: 4,
    role: 'CUSTOMS',
    loginPath: '/user/login_customs',
    routerNameHome: 'dashboard'
  }
]

export const entityRolesData = (() => {
  return entityRolesDataSource.filter(item => item.role !== 'ADMIN' && item.role !== 'CUSTOMS')
})()

export const customsRegionData = [
  {
    key: 1,
    role: 'A'
  },
  {
    key: 2,
    role: 'B'
  },
  {
    key: 3,
    role: 'C'
  },
  {
    key: 4,
    role: 'D'
  }
]

export const permissionsLevelData = [
  {
    key: 0,
    level: 'BASIC'
  },
  {
    key: 1,
    level: 'ADMIN'
  }
]

export const countryData = [
  {
    key: 1,
    country: 'SG'
  },
  {
    key: 2,
    country: 'TW'
  },
  {
    key: 3,
    country: 'TH'
  },
  {
    key: 4,
    country: 'MY'
  },
  {
    key: 5,
    country: 'PH'
  }
]

export const importerRelatedEntityData = [
  {
    taxId: '11833655',
    exportersTaxIds: ['19660239N', '200802267C', '000000'],
    cbTaxIds: ['05060358', '23250583']
  },
  {
    taxId: '11768704',
    exportersTaxIds: ['200304205W'],
    cbTaxIds: ['00812416']
  }
]

export const filterEntities = (loginUserInfo, roleCode, originalEntities) => {
  const importerRelatedEntities = importerRelatedEntityData.find(i => i.taxId === loginUserInfo.company.taxId)
  if (importerRelatedEntities) {
    if (roleCode === 'EXPORTER') {
      return originalEntities.filter(e => importerRelatedEntities.exportersTaxIds.includes(e.taxId))
    } else if (roleCode === 'CUSTOMS_BROKER') {
      return originalEntities.filter(e => importerRelatedEntities.cbTaxIds.includes(e.taxId))
    } else {
      return originalEntities
    }
  } else {
    return originalEntities
  }
}
