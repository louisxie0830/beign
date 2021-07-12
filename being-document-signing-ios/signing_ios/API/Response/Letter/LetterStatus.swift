//
//  LetterStatus.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/22.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import CodableAlamofire

struct LetterStatus: Responseable, Decodable {
    var code: Int
    var message: String
    let data: LetterStatusData
    
    enum CodingKeys: String, CodingKey {
        case code
        case message
        case data
    }
}

struct LetterStatusData: Decodable {
    let pending: Int
    let myOwn: Int
    let sendToMe: Int
    
    enum CodingKeys: String, CodingKey {
        case pending
        case myOwn
        case sendToMe
    }
}
