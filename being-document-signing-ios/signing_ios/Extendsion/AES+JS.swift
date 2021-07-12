//
//  AES+JS.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/1.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import CryptoSwift

public extension AES {
    class func encrpty(_ text: String, pwd: String) -> [UInt8]? {
        var result: [UInt8]? = nil
        
        let salt = AES.randomIV(8)
        let key_iv = AES.getKey(pwd, salt: salt)
        let key = Array(key_iv[0..<32])
        let iv = Array(key_iv[32..<48])
        
        do {
            let encrypted = try AES(key: key, blockMode: CBC(iv: iv), padding: .pkcs7).encrypt(text.bytes)
            result = ("Salted__".bytes + salt + encrypted)
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
    
    class func decrypt(_ text: String, pwd: String) -> [UInt8]? {
        var result: [UInt8]? = nil
        let encrypted = Array(base64: text)
        assert(encrypted[0..<8].elementsEqual("Salted__".bytes), "salt error")
        let salt = encrypted[8..<16]
        let key_iv = AES.getKey(pwd, salt: Array(salt))
        let key = Array(key_iv[0..<32])
        let iv = Array(key_iv[32..<48])
        
        do {
            result = try AES(key: key, blockMode: CBC(iv: iv), padding: .pkcs7).decrypt(encrypted[16..<encrypted.count])
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
    
    private class func getKey(_ string: String, salt: [UInt8]) -> [UInt8] {
        assert(salt.count == 8, "salt length != 8")
        
        let OUTPUT_LENGTH: Int = 48
        let data = string.bytes + salt
        var key = data.md5()
        var final_key = key
        
        while final_key.count < OUTPUT_LENGTH {
            key = (key + data).md5()
            final_key += key
        }
        
        return final_key
    }
}
