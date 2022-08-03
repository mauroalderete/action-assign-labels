const inputValidator = require('../src/inputsValidator')

describe('inputs validations', () => {

    
    describe('validate pull-request number', () => {

        it('without value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber()
            } ).toThrow()
        })

        it('null value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber(null)
            } ).toThrow()
        })

        it('undefined value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber(undefined)
            } ).toThrow()
        })

        it('empty value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber('')
            } ).toThrow()
        })

        it('not numeric value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber('')
            } ).toThrow()
        })

        it('numeric value', () => {
            expect( ()=>{
                inputValidator.pullRequestNumber('45')
            } ).not.toThrow()
        })
    })

    describe('validate github-token', () => {

        it('without value', () => {
            expect( ()=>{
                inputValidator.githubToken()
            } ).toThrow()
        })

        it('null value', () => {
            expect( ()=>{
                inputValidator.githubToken(null)
            } ).toThrow()
        })

        it('undefined value', () => {
            expect( ()=>{
                inputValidator.githubToken(undefined)
            } ).toThrow()
        })

        it('empty value', () => {
            expect( ()=>{
                inputValidator.githubToken('')
            } ).toThrow()
        })

        it('empty value', () => {
            expect( ()=>{
                inputValidator.githubToken('some hash')
            } ).not.toThrow()
        })
    })
})
