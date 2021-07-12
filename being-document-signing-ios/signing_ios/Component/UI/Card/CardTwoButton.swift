//
//  CardTwoButton.swift
//  signing_ios
//
//  Created by Alex on 2019/4/18.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol TwoButtonCellDelegate {
    func  nextButtonEvent()
    func  backButtonEvent()
}

class CardTwoButton: UITableViewCell {
    var delegate: TwoButtonCellDelegate?
    
    @IBOutlet weak var nextButton: RaisedButton! {
        didSet {
            nextButton.layer.cornerRadius = 22
            nextButton.backgroundColor = UIColor.aqua
            nextButton.disable = true
        }
    }
    
    @IBOutlet weak var backButton: RaisedButton! {
        didSet {
            backButton.layer.cornerRadius = 22
            backButton.backgroundColor = UIColor.aqua
            backButton.disable = false
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
    @IBAction func nextButtonAction() {
        delegate?.nextButtonEvent()
    }
    @IBAction func backButtonAction() {
        delegate?.backButtonEvent()
    }
}
