//
//  CardSelectCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/17.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

class CardSelectCell: UITableViewCell {
    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:0)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.textColor = UIColor(red:0.10, green:0.12, blue:0.15, alpha:0.4)
        }
    }
    @IBOutlet weak var selectView: UIView! {
        didSet {
            selectView.layer.borderWidth = 1
            selectView.borderColor = UIColor.lightPeriwinkle
            selectView.layer.cornerRadius = 8
        }
    }
    @IBOutlet weak var selectTitleLabel: UILabel! {
        didSet {
            selectTitleLabel.textColor = UIColor.slateGrey
        }
    }
    @IBOutlet weak var dropDownImageView: UIImageView! {
        didSet {
            dropDownImageView.tintColor = UIColor.slateGrey
            dropDownImageView.image = UIImage(named: "baseline_arrow_drop_down_white_24pt")
        }
    }
    @IBOutlet weak var supLabel: UILabel! {
        didSet {
            supLabel.textColor = UIColor(red:0.10, green:0.12, blue:0.15, alpha:0.28)
        }
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
