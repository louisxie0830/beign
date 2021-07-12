//
//  CardBuyCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/17.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol CardBuyCellDelegate {
    func  selectItem(row: Int)
}

class CardBuyCell: UITableViewCell {
    var delegate: CardBuyCellDelegate?
    var row: Int!
    
    
    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:0)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    @IBOutlet weak var selectButton: RaisedButton! {
        didSet {
            selectButton.layer.borderColor = UIColor.coolGrey.cgColor
            selectButton.layer.borderWidth = 1.0
            selectButton.layer.cornerRadius = 12
        }
    }
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.textColor = UIColor.slateGreyTwo;
        }
    }
    @IBOutlet weak var priceLabel: UILabel! {
        didSet {
            priceLabel.textColor = UIColor.slateGreyTwo;
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
    @IBAction func selectButtonAction() {
        delegate?.selectItem(row: row)
    }
}
