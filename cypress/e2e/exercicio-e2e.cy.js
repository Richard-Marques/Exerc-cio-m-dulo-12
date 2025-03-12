/// <reference types="cypress" />
import produtosPage from "../support/page_objects/produtos-page"

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    let dadosLogin

    before(() => {
        // Carregar os dados de login da fixture
        cy.fixture('perfil').then((perfil) => {
            dadosLogin = perfil
        });
    });

    beforeEach(() => {
        // Visitar a página de login e faz o login
        cy.visit('minha-conta')
        cy.login(dadosLogin.usuario, dadosLogin.senha)
        
        // Garantir que o login foi bem-sucedido
        cy.get('.page-title').should('contain', 'Minha conta'); // Verificar se a página "Minha conta" está visível após o login
        produtosPage.visitarUrl(); 
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        // Carregar os dados da fixture
        cy.fixture('produtos').then((produtos) => {
            produtos.forEach(produto => {
                produtosPage.buscarProduto(produto.nomeProduto)
                produtosPage.addProdutoCarrinho(produto.tamanho, produto.cor, produto.quantidade)

                // Validando se a quantidade do produto foi adicionada ao carrinho corretamente
                cy.get('.woocommerce-message').should('contain', `${produto.quantidade} × “${produto.nomeProduto}” foram adicionados no seu carrinho.`)
            });


            cy.get('.dropdown-toggle > .text-skin > .icon-basket').click() 
            cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .view-cart').click();
            cy.get('.cart_item').should('have.length', produtos.length) // Verifica se o número de itens no carrinho é igual ao número de produtos
        });

        cy.get('.checkout-button').click()
        cy.get('#terms').click()
        cy.get('#place_order').click()
        cy.get('.woocommerce-notice', { timeout: 10000 }).should('contain', 'Obrigado. Seu pedido foi recebido.') // Validando a compra
    });


})