//
//  IndexCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/8.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class IndexCell: UICollectionViewCell {
    @IBOutlet weak var bageLabel: UILabel! {
        didSet {
            bageLabel.clipsToBounds = true
            bageLabel.layer.cornerRadius = 12.0
            bageLabel.backgroundColor = UIColor.aqua
            bageLabel.textColor = UIColor.white
        }
    }
    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.cornerRadius = 8.0
            bgView.layer.shadowOffset = CGSize(width: 1, height:1)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    @IBOutlet weak var countLabel: UILabel! {
        didSet {
            countLabel.textColor = UIColor.aqua
        }
    }
    @IBOutlet weak var iconImageView: UIImageView! {
        didSet {
            iconImageView.tintColor = UIColor.aqua
        }
    }
    @IBOutlet weak var iconTitleLabel: UILabel!
}
