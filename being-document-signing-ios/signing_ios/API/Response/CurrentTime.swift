//
//  CurrentTime.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/3.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation

struct CurrentTime: Responseable, Decodable {
    var code: Int
    var message: String
    let timestamp: Int
    
    enum CodingKeys: String, CodingKey {
        case code
        case message
        case timestamp
    }
}
