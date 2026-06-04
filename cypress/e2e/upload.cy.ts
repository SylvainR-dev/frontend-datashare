/// <reference types="cypress" />

describe('Upload de fichier', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[formControlName="email"]').type('cypress@test.com')
    cy.get('input[formControlName="password"]').type('Password123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/upload')
  })

  it('should upload a file and display download link', () => {
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('contenu test'),
      fileName: 'test.pdf',
      mimeType: 'application/pdf'
    }, { force: true })

    cy.get('.btn-submit', { timeout: 5000 }).should('be.visible').click()

    cy.get('.link-box', { timeout: 10000 }).should('be.visible')
  })

})