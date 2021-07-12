//
//  CardLabelCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/17.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class CardLabelCell: UITableViewCell {
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
    @IBOutlet weak var countLabel: UILabel! {
        didSet {
            countLabel.textColor = UIColor.coolBlue
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
