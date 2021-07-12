//
//  CardButtonCell.swift
//  signing_ios
//
//  Created by Alex on 2019/3/27.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

class CardButtonCell: UITableViewCell {

    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:-1)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xs()
            titleLabel.textColor = UIColor.dark40
        }
    }
    
    @IBOutlet weak var boundView: UIView! {
        didSet {
            boundView.layer.cornerRadius = 8.0
            boundView.layer.borderWidth = 1.0
            boundView.layer.borderColor = UIColor.lightPeriwinkle.cgColor
            boundView.layer.masksToBounds = true
        }
    }
    @IBOutlet weak var textField: UITextField!
    
    @IBOutlet weak var cardButton: RaisedButton! {
        didSet {
            cardButton.layer.cornerRadius = 20;
            cardButton.borderColor = UIColor.robinWggBlue
            cardButton.titleColor = UIColor.turquoiseBlue
            cardButton.layer.borderWidth = 1.0
        }
    }
    
    @IBOutlet weak var errorLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
