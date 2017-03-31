//module dependencies
var expect = require('chai').expect;
var should = require('chai').should();
var fs = require('fs')  
var request = require('request');
var webpage = require('../../routes/index')

//test
describe('The webpage module', function () {  
  it('saves the content', function * () {
    const url = '/'
    const content = '<h1>title</h1>'
    const writeFileStub = this.sandbox.stub(fs, 'writeFile', function (filePath, fileContent, cb) {
      cb(null)
    })

    const requestStub = this.sandbox.stub(request, 'get', function (url, cb) {
      cb(null, null, content)
    })

    const result = yield webpage.saveWebpage(url)

    expect(writeFileStub).to.be.calledWith()
    expect(requestStub).to.be.calledWith(url)
    expect(result).to.eql('page')
  })
})
