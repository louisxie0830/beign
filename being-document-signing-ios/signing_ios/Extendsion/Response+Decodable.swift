//
//  Response.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/3.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import Moya

extension Response {
    func mapObject<T>(_type: T.Type, using decoder: JSONDecoder = .init()) throws -> T where T: Decodable {
        return try decoder.decode(T.self, from: data)
    }
    
    func mapArray<T>(_ type: T.Type, using decoder: JSONDecoder = .init()) throws -> [T] where T: Decodable {
        return try decoder.decode(Array<T>.self, from: data)
    }
}
