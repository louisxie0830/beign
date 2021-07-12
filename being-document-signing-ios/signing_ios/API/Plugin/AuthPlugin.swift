//
//  AuthPlugin.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/19.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import Moya

class TokenSource {
    static let shared = TokenSource()
    var token: String?
}

struct AuthPlugin: PluginType {
    let tokenClosure: () -> String?
    
    func prepare(_ request: URLRequest, target: TargetType) -> URLRequest {
        var request = request
        
        if let token = tokenClosure() {
            request.addValue("Bearer " + token, forHTTPHeaderField: "Authorization")
        }
        
        return request
    }
}
