//
//  InputSectionData.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/25.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import RxDataSources

struct InputSectionData  {
    var items: [Item]
}

extension InputSectionData: SectionModelType {
    typealias Item = InputData
    
    init(original: InputSectionData, items: [Item]) {
        self = original
        self.items = items
    }
}
