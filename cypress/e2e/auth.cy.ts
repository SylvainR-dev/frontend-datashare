/// <reference types="cypress" />

describe('Création de compte', () => {

  const email = `cypress_${Date.now()}@test.com`
  const password = 'Password123'

  it('should register a new user and redirect to login', () => {
    cy.visit('/register')

    cy.get('input[formControlName="email"]').type(email)
    cy.get('input[formControlName="password"]').type(password)

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/login')
  })

  it('should login with valid credentials and redirect to upload', () => {
    cy.visit('/login')

    cy.get('input[formControlName="email"]').type(email)
    cy.get('input[formControlName="password"]').type(password)

    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/upload')
  })

})