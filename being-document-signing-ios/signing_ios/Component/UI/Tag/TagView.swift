//
//  TagView.swift
//  signing_ios
//
//  Created by Alex on 2019/4/3.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material

protocol TagViewDelegate {
    func deleteTagView(deleteTag: Int)
}

class TagView: UIView {
    var delegate: TagViewDelegate?
    @IBOutlet weak var contentLabel: UILabel!
    @IBOutlet weak var deleteButton: RaisedButton! {
        didSet {
            deleteButton.layer.cornerRadius = 8.0
            deleteButton.backgroundColor = UIColor.aqua
            deleteButton.tintColor = UIColor.white
        }
    }
    
//    override init(frame: CGRect) {
//        super.init(frame: frame)
//        
//        print("init(frame:)")
//    }
//    
//    required init?(coder aDecoder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//    
    override func awakeFromNib() {
        super.awakeFromNib()
        deleteButton.layer.cornerRadius = 8.0
        contentLabel.textColor = UIColor.aqua
        self.layer.cornerRadius = 6.0
        self.layer.borderWidth = 1.0
        self.layer.borderColor = UIColor.aqua.cgColor
        self.layer.masksToBounds = true
    }
    
    func setText(titleString: String) {
        contentLabel.text = titleString
        contentLabel.sizeToFit()
    }
    
    @IBAction func deleteEvent() {
        guard let delegate = delegate else {
            return
        }
                
        delegate.deleteTagView(deleteTag: self.tag)
    }
}
