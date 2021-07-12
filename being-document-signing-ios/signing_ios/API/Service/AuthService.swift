//
//  AuthService.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/3.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import Moya
import RxSwift
import Result

let authProvider = MoyaProvider<AuthService>(plugins: [
    AuthPlugin(tokenClosure: { return TokenSource.shared.token })
    ])

enum AuthService {
    case currentTime
    case login(_ request: LoginRequest)
    case logout
}

extension AuthService: TargetType, AccessTokenAuthorizable {
    var authorizationType: AuthorizationType {
        switch self {
        case .currentTime:
            return .none
        case .login:
            return .none
        case .logout:
            return .bearer
        }
    }
    
    var baseURL: URL {
        return URL(string: "https://backend-signing-test.beingtech.org")!
    }
    
    var path: String {
        switch self {
        case .currentTime:
            return "auth/currentTime"
        case .login:
            return "auth/login"
        case .logout:
            return "auth/logout"
        }
    }
    
    var method: Moya.Method {
        switch self {
        case .currentTime:
            return .get
        case .login:
            return .post
        case .logout:
            return .post
        }
    }
    
    var sampleData: Data {
        return "".utf8Encoded
    }
    
    var task: Task {
        switch self {
        case .currentTime:
            return .requestPlain
        case .login(let request):
            return .requestJSONEncodable(request)
        case .logout:
            return .requestPlain
        }
    }
    
    var headers: [String : String]? {
        return [
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "accept-languate" : "zh-tw",
            "x-being-area" : "tw"
        ]
    }
}
