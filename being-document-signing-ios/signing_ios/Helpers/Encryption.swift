//
//  Encryption.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/3/28.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import web3swift
import CryptoSwift

class Encryption {
    class func getPrivateKey(_ mail: String) -> String? {
        var result: String? = nil
        
        do {
            let random = try Random.generate(byteCount: 256)
            let rand = Data(bytes: random, count: random.count).string
            let join = [String](repeating: (mail + rand), count: 1000).joined(separator: "")
            let privatekey = SHA3(variant: .keccak256).calculate(for: join.bytes).toHexString()
            result = "0x" + privatekey
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
    
    class func getSecretKey(_ mail: String, password: String) -> String? {
        var result: String? = nil
        
        do {
            result = try PKCS5.PBKDF2(password: password.bytes, salt: mail.bytes, iterations: 1000, keyLength: 64, variant: .sha1).calculate().toHexString()
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
    
    class func getCerPwd(_ privateKey: String, secretKey: String) -> String? {
        guard let encrypted = AES.encrpty(privateKey, pwd: secretKey) else {
            return nil
        }
        
        return encrypted.toBase64()
    }
    
    class func getDecryptedData(_ cerPwd: String, secretKey: String) -> String? {
        guard let decrypted = AES.decrypt(cerPwd, pwd: secretKey) else {
            return nil
        }
        
        return String(bytes: decrypted, encoding: .utf8)
    }
    
    class func setAddress(_ privateKey: String) -> String? {
        var result: String? = nil
        
        do {
            let hex = privateKey.hex
            guard let eth = try EthereumKeystoreV3(privateKey: hex) else {
                return nil
            }
            result = eth.address?.address
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
    
    class func signature(_ payload: Data, privateKey: String) -> String? {
        var result: String? = nil
        
        do {
            let sign = try PrivateKey(privateKey.hex).sign(hash: payload.keccak256())
            result = "0x" + sign.data.hex
        }
        catch(let error) {
            print("\(error.localizedDescription)")
        }
        
        return result
    }
}
