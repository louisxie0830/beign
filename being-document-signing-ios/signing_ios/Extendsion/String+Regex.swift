//
//  String+Regex.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/22.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation

extension String {
    func regex(_ reg: String) -> Bool {
        let regex = try! NSRegularExpression(pattern: reg)
        let matches = regex.matches(in: self, options: [], range: NSRange(location: 0, length: self.count))
        
        return matches.count == 1
    }
}
