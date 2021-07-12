//
//  LetterService.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/22.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import Moya
import RxSwift
import Result

let letterProvider = MoyaProvider<LetterService>(plugins: [
    AuthPlugin(tokenClosure: { return TokenSource.shared.token })
    ])

enum LetterService {
    case status
}

extension LetterService: TargetType, AccessTokenAuthorizable {
    var authorizationType: AuthorizationType {
        switch self {
        case .status:
            return .bearer
        }
    }
    
    var baseURL: URL {
        return URL(string: "https://backend-signing-test.beingtech.org")!
    }
    
    var path: String {
        switch self {
        case .status:
            return "letter/status"
        }
    }
    
    var method: Moya.Method {
        switch self {
        case .status:
            return .get
        }
    }
    
    var sampleData: Data {
        return "".utf8Encoded
    }
    
    var task: Task {
        switch self {
        case .status:
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
