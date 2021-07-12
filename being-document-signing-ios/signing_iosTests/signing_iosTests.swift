//
//  signing_iosTests.swift
//  signing_iosTests
//
//  Created by Rock Chen on 2019/3/20.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import XCTest
@testable import signing_ios

class signing_iosTests: XCTestCase {

    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct results.
    }

    func testPerformanceExample() {
        // This is an example of a performance test case.
        self.measure {
            // Put the code you want to measure the time of here.
        }
    }
    
    func testEncryption() {        
        let mail = "abcde22345@8888play.com"
        let password = "abcde22345"
        let privateKey = Encryption.getPrivateKey(mail)!
        let secretKey = Encryption.getSecretKey(mail, password: password)!
        let cerPwd = Encryption.getCerPwd(privateKey, secretKey: secretKey)!
        let unPrivateKey = Encryption.getDecryptedData(cerPwd, secretKey: secretKey)!
        let address = Encryption.setAddress(unPrivateKey)!
        let sign = Encryption.signature("Some Data".data(using: .utf8)!, privateKey: privateKey)
        
        print("private key: \(privateKey)")
        print("secret key: \(secretKey)")
        print("cerPwd: \(cerPwd)")
        print("解壓的Key: \(unPrivateKey)")
        print("Address: \(address)")
        print("sign: \(sign!)")
    }
    
    func testLogin() {
        let expectation = self.expectation(description: "Login")
        
        let request = LoginRequest(email: "abcde22345@8888play.com", password: "abcde22345")
        authProvider.request(.login(request)) { (result) in
            switch result {
            case let .success(response):
                do {
                    let model = try response.mapObject(_type: Login.self)
                    print("\(model)")
                }
                catch(let error) {
                    print("\(error.localizedDescription)")
                }
            case let .failure(error):
                print("\(error.localizedDescription)")
            }
            expectation.fulfill()
        }
        
        self.waitForExpectations(timeout: 10.0) { (error) in
            
        }
    }
    
    func testCurrentTime() {
        let expectation = self.expectation(description: "currentTime")
        
        authProvider.request(.currentTime) { (result) in
            switch result {
            case let .success(response):
                do {
                    let model = try response.mapObject(_type: CurrentTime.self)
                    print("\(model)")
                }
                catch(let error) {
                    print("\(error.localizedDescription)")
                }
            case let .failure(error):
                print("\(error.localizedDescription)")
            }
            expectation.fulfill()
        }
        
        self.waitForExpectations(timeout: 10.0) { (error) in
            
        }
    }
}
