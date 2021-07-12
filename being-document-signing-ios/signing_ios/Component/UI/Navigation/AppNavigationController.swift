//
//  AppNavigationController.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/3/22.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import UIKit
import Material

class AppNavigationController: NavigationController {

    open override func prepare() {
        super.prepare()
        
        guard let bar = navigationBar as? NavigationBar else {
            return
        }
        
        bar.depthPreset = .depth3
        bar.backgroundColor = Color.white
    }
}
