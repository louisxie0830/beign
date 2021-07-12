//
//  TagViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/3.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class TagViewController: UIViewController, TagViewDelegate {
    let disposed = DisposeBag()
    var dataArray: [[String : String]] = []
    
    
    let screenSize = UIScreen.main.bounds.size.width - 20
    
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var scrollContentView: UIView!
    @IBOutlet weak var contentView: UIView! {
        didSet {
            contentView.layer.cornerRadius = 8.0
        }
    }
    
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xs()
            titleLabel.textColor = UIColor.dark40
        }
    }
    
    @IBOutlet weak var bgView: UIView!
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
    
    @IBOutlet weak var tagTitleLabel: UILabel!
    @IBOutlet weak var tagCountLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setTagCountLabel()
        navigationItem.titleLabel.text = "設定簽署標籤"
        cardButton.rx.tap.subscribe(onNext: {
            if self.dataArray.count < 20 && self.textField.text != "" {
                self.dataArray.append(["title" : self.textField.text!])
                self.removeAllTageView(tag: 99)
                self.textField.text = ""
            }
        }).disposed(by: disposed)
        // Do any additional setup after loading the view.
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if dataArray.count > 0 {
            setup()
        }
    }
    
    func setup() {
        
        let contentWidth: CGFloat = contentView.frame.size.width
        
        
        var originY: CGFloat = 0.0
        var originX: CGFloat = 0.0
        var hCount: CGFloat = 0.0
        
        
        for i in 0...dataArray.count - 1 {
            let tagView: TagView = UINib(nibName: "TagView", bundle: .main).instantiate(withOwner: nil, options: nil).first as! TagView
            tagView.delegate = self
            
            let data: Dictionary = dataArray[i]
            let titleString: String = data["title"]!
            
            tagView.tag = i
            tagView.setText(titleString: titleString)
            let tagTitleLabelRect: CGRect = tagTitleLabel.frame
            
            originX = tagTitleLabelRect.origin.x + originX
            
            if hCount == 0 {
                originY = tagTitleLabelRect.origin.y + tagTitleLabelRect.size.height + 10.0
            }
            
            if originX + tagView.contentLabel.frame.size.width + 44 > contentWidth - 10 {
                hCount += 1
                originX = tagTitleLabelRect.origin.x
                originY = tagTitleLabelRect.origin.y + tagTitleLabelRect.size.height + tagView.frame.size.height * hCount + 10.0 * (hCount + 1)
            }
            
            tagView.frame = CGRect(x: originX,
                                   y: originY,
                                   width: tagView.contentLabel.frame.size.width + 44,
                                   height: 32)
            
            contentView.addSubview(tagView)
            originX = originX + tagView.frame.size.width
            
        }
        contentView.frame = CGRect(x: contentView.frame.origin.x,
                                   y: contentView.frame.origin.y,
                                   width: contentWidth,
                                   height: originY + 32 + 30)
        scrollView.contentSize = CGSize(width: scrollView.frame.size.width,
                                        height: contentView.frame.size.height + 44)
    }
    
    private func setTagCountLabel() {
        let dataString: String = String(dataArray.count)
        let baseString = dataString + "/20"
        let attributedString = NSMutableAttributedString(string: baseString)
        
        attributedString.addAttribute(.foregroundColor,
                                      value: UIColor.aqua,
                                      range: NSString(string: baseString).range(of: dataString))
        
        attributedString.addAttribute(.foregroundColor,
                                      value: UIColor.gray,
                                      range: NSString(string: baseString).range(of: "/20"))
        tagCountLabel.attributedText = attributedString
    }
    
    private func removeAllTageView(tag: Int) {
        let views = contentView.subviews
        
        for i in 0...views.count - 1 {
            let cView = views[i]
            if cView.isKind(of: TagView.self) {
                cView.removeFromSuperview()
            }
        }
        if tag != 99 {
            dataArray.remove(at: tag)
        }
        if dataArray.count > 0 {
            setup()
        }
        else {
            contentView.frame = CGRect(x: contentView.frame.origin.x,
                                       y: contentView.frame.origin.y,
                                       width: contentView.frame.size.width,
                                       height: tagTitleLabel.frame.origin.y + tagTitleLabel.frame.size.height + 10)
        }
        setTagCountLabel()
    }
    
    func deleteTagView(deleteTag: Int) {
        removeAllTageView(tag: deleteTag)
    }
    
}
