//
//  CardBoxCell.swift
//  signing_ios
//
//  Created by Alex on 2019/3/27.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol CardBoxCellDelegate {
    func touch(type: String)
    func agree(isAgree: Bool)
}

//struct CatchLoginStateObj: LoginStateChange {
//    func userIsLogin() {
//        // Do something.
//    }
//}
class CardBoxCell: UITableViewCell {
    
    var delegate: CardBoxCellDelegate?
    var isAgree: Bool?
    @IBOutlet weak var bgView: UIView! {
        didSet {
            bgView.layer.shadowOffset = CGSize(width: 2, height:-1)
            bgView.layer.shadowRadius = 0
            bgView.layer.shadowOpacity = 1
            bgView.layer.shadowColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12).cgColor
        }
    }
    
    @IBOutlet weak var boxButton: RaisedButton! {
        didSet {
            boxButton.backgroundColor = UIColor.white
            boxButton.borderColor = UIColor(red:0.84, green:0.85, blue:0.87, alpha:1.0)
            boxButton.layer.borderWidth = 1
            boxButton.layer.cornerRadius = 2
        }
    }
    
    @IBOutlet weak var contentLabel: UILabel! {
        didSet {
            contentLabel.isUserInteractionEnabled = true
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        isAgree = false
        let baseString = String(format: "read_and_agree".localized(), arguments: ["terms".localized(), "privacy".localized()])
        
        let attributedString = NSMutableAttributedString(string: baseString)
        
        attributedString.addAttribute(.foregroundColor,
                                      value: UIColor.turquoiseBlue,
                                      range: NSString(string: baseString).range(of: "terms".localized()))
        
        attributedString.addAttribute(.foregroundColor,
                                      value: UIColor.turquoiseBlue,
                                      range: NSString(string: baseString).range(of: "privacy".localized()))

        contentLabel.attributedText = attributedString
        contentLabel.sizeToFit()
        
        let gestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(tapLabel(gesture:)))
        gestureRecognizer.numberOfTouchesRequired = 1
        self.contentLabel.addGestureRecognizer(gestureRecognizer)
    }

    @IBAction func tapLabel(gesture: UITapGestureRecognizer) {
        let text = (contentLabel.text)!
        
        let termsRange = (text as NSString).range(of: "terms".localized())
        let privacyRange = (text as NSString).range(of: "privacy".localized())
        
        if gesture.didTapAttributedTextInLabel(label: contentLabel, targetRange: termsRange) {
            delegate?.touch(type: "terms")
            
        }
        else if gesture.didTapAttributedTextInLabel(label: contentLabel, targetRange: privacyRange) {
            delegate?.touch(type: "privacy")
        }
        else {
            print("Tapped none")
        }
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    @IBAction func boxButtonAction() {
        isAgree = !isAgree!
        if isAgree! {
            boxButton.backgroundColor = UIColor.aqua
            boxButton.image = UIImage(named: "outline_done_white_24pt")
            boxButton.layer.borderWidth = 0
            boxButton.layer.cornerRadius = 2
        }
        else {
            boxButton.backgroundColor = UIColor.white
            boxButton.borderColor = UIColor(red:0.84, green:0.85, blue:0.87, alpha:1.0)
            boxButton.layer.borderWidth = 1
            boxButton.layer.cornerRadius = 2
        }
        
        guard let delegate = delegate else {
            return
        }
        delegate.agree(isAgree: isAgree!)
    }
}
