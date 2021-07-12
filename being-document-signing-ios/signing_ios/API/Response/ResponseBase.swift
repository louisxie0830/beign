//
//  ResponseBase.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/19.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import CodableAlamofire

protocol Responseable {
    var code: Int { get }
    var message: String { get }
}

struct ResponseBase: Responseable, Decodable {
    var code: Int
    var message: String
    
    enum CodingKeys: String, CodingKey {
        case code
        case message
    }
}
