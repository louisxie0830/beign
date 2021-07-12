//
//  String+Localized.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/1.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation

extension String {
    func localized() -> String {
        return NSLocalizedString(self, comment: "")
    }
}
