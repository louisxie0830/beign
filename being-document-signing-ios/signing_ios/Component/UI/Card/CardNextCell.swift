//
//  CardNextCell.swift
//  signing_ios
//
//  Created by Alex on 2019/4/17.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol NextCellDelegate {
    func  nextButtonEvent()
}

class CardNextCell: UITableViewCell {

    var delegate: NextCellDelegate?
    @IBOutlet weak var nextButton: RaisedButton! {
        didSet {
            nextButton.layer.cornerRadius = 22
            nextButton.backgroundColor = UIColor.aqua
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
}
