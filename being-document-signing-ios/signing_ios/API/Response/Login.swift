//
//  LoginResponse.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/3.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import CodableAlamofire

struct Login: Responseable, Decodable {
    var code: Int
    var message: String
    let token: String
    let lang: String
    let name: String
    
    enum CodingKeys: String, CodingKey {
        case code
        case message
        case token
        case lang
        case name
    }
}
