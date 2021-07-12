//
//  LoginRequest.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/3.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation

struct LoginRequest: Encodable {
    let email: String
    let password: String
}
