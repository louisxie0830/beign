//
//  SignFileCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/26.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

class SignFileCell: UITableViewCell {

    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:0)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    
    @IBOutlet weak var iconImageView: UIImageView! {
        didSet {
            iconImageView.image = UIImage(named: "outline_insert_drive_file_white_24pt")
            iconImageView.tintColor = UIColor.dark28
        }
    }
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.smaller()
            titleLabel.textColor = UIColor.dark40
        }
    }
    @IBOutlet weak var subLabel: UILabel! {
        didSet {
            subLabel.smaller()
            subLabel.textColor = UIColor.dark40
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
