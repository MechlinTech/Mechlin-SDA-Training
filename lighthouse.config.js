module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/health'],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.5 }],
        'categories:best-practices': ['warn', { minScore: 0.5 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};