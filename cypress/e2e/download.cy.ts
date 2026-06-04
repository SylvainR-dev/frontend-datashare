/// <reference types="cypress" />

describe('Téléchargement via lien', () => {

  it('should display file info on download page', () => {
    cy.visit('/login')
    cy.get('input[formControlName="email"]').type('cypress@test.com')
    cy.get('input[formControlName="password"]').type('Password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/upload')

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('contenu test'),
      fileName: 'test.pdf',
      mimeType: 'application/pdf'
    }, { force: true })

    cy.get('.btn-submit', { timeout: 5000 }).should('be.visible').click()

    cy.get('.link-box a', { timeout: 10000 }).invoke('text').then((link) => {
      const token = link.trim().split('/').pop()
      cy.visit(`/download/${token}`)
      cy.get('.file-name', { timeout: 5000 }).should('be.visible')
    })
  })

})