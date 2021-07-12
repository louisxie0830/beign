//
//  SplashPageCell.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/3/20.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import UIKit

class SplashPageCell: UICollectionViewCell {
    
    @IBOutlet weak var splashImageView: UIImageView!
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xxl()
            titleLabel.textColor = UIColor.dark
        }
    }
    @IBOutlet weak var contentLabel: UILabel! {
        didSet {
            contentLabel.s()
            contentLabel.textColor = UIColor.dark.withAlphaComponent(0.56)
        }
    }
    
}
