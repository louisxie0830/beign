//
//  CardCell.swift
//  signing_ios
//
//  Created by Alex on 2019/3/25.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift

// CardFieldCell
class CardFieldCell: UITableViewCell {
    
    var disposed = DisposeBag()
    
    @IBOutlet weak var leadingConstraint: NSLayoutConstraint!
    
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
            titleLabel.xs()
            titleLabel.textColor = UIColor.dark40
        }
    }
    
    @IBOutlet weak var problemButton: RaisedButton! {
        didSet {
            problemButton.backgroundColor = UIColor.aqua
            problemButton.titleColor = UIColor.white
            problemButton.layer.cornerRadius = 8.0
        }
    }
    
    @IBOutlet weak var supLabel: UILabel! {
        didSet {
            supLabel.text = ""
            supLabel.xs()
            supLabel.textColor = UIColor.dark28
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
    @IBOutlet weak var errorLabel: UILabel! {
        didSet {
            errorLabel.text = ""
        }
    }
    
    override func prepareForReuse() {
        self.disposed = DisposeBag()
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

    public func setupUI(type: String) {
        if type == "cardfield" {
            leadingConstraint.constant = -4
            problemButton.isHidden = true
        }
        else {
            leadingConstraint.constant = 4
            problemButton.isHidden = false
        }
        titleLabel.setNeedsLayout()
        titleLabel.sizeToFit()
    }
}
