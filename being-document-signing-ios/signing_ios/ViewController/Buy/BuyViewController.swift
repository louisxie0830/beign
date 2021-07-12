//
//  BuyViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/15.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class BuyViewController: UIViewController, BuyTypeViewDelegate, BuyInputViewDelegate {
    let scrollTime: TimeInterval = 0.3
    weak var buyTypeView: BuyTypeView!
    weak var buyInputView: BuyInputView!
    @IBOutlet weak var topView: UIView!
    @IBOutlet weak var scrollView: UIScrollView!
    
    @IBOutlet weak var oneToTwoLine: UIView! {
        didSet {
            oneToTwoLine.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
        }
    }
    @IBOutlet weak var twoToThreeLine: UIView! {
        didSet {
            twoToThreeLine.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
        }
    }
    
    @IBOutlet weak var scheduleLabel1: UILabel! {
        didSet {
            scheduleLabel1.layer.cornerRadius = 16
            scheduleLabel1.textColor = UIColor.white
            scheduleLabel1.backgroundColor = UIColor.aqua
        }
    }
    @IBOutlet weak var scheduleLabel2: UILabel! {
        didSet {
            scheduleLabel2.layer.cornerRadius = 16
            scheduleLabel2.textColor = UIColor.white
            scheduleLabel2.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
        }
    }
    @IBOutlet weak var scheduleLabel3: UILabel! {
        didSet {
            scheduleLabel3.layer.cornerRadius = 16
            scheduleLabel3.textColor = UIColor.white
            scheduleLabel3.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
        }
    }
    @IBOutlet weak var scheduleTitleLabel1: UILabel! {
        didSet {
            scheduleTitleLabel1.textColor = UIColor(red:0.22, green:0.22, blue:0.22, alpha:1.0)
        }
    }
    @IBOutlet weak var scheduleTitleLabel2: UILabel! {
        didSet {
            scheduleTitleLabel2.textColor = UIColor(red:0, green:0, blue:0, alpha:0.26)
        }
    }
    @IBOutlet weak var scheduleTitleLabel3: UILabel! {
        didSet {
            scheduleTitleLabel3.textColor = UIColor(red:0, green:0, blue:0, alpha:0.26)
        }
    }
    @IBOutlet weak var scheduleImageView1: UIImageView! {
        didSet {
            scheduleImageView1.isHidden = true
            scheduleImageView1.image = Icon.cm.check
            scheduleImageView1.backgroundColor = UIColor.robinWggBlue
            scheduleImageView1.layer.cornerRadius = 16
        }
    }
    @IBOutlet weak var scheduleImageView2: UIImageView! {
        didSet {
            scheduleImageView2.isHidden = true
            scheduleImageView2.image = Icon.cm.check
            scheduleImageView2.backgroundColor = UIColor.robinWggBlue
            scheduleImageView2.layer.cornerRadius = 16
        }
    }
    @IBOutlet weak var scheduleImageView3: UIImageView! {
        didSet {
            scheduleImageView3.isHidden = true
            scheduleImageView3.image = Icon.cm.check
            scheduleImageView3.backgroundColor = UIColor.robinWggBlue
            scheduleImageView3.layer.cornerRadius = 16
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.titleLabel.text = "購買方案"
        // Do any additional setup after loading the view.
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        setup()
    }
    
    private func setup() {
        buyTypeView = (UINib(nibName: "BuyTypeView", bundle: .main).instantiate(withOwner: nil, options: nil).first as! BuyTypeView)
        buyTypeView.frame = CGRect(x: 0,
                                   y: 0,
                                   width: scrollView.frame.size.width,
                                   height: scrollView.frame.size.height)
        buyTypeView.delegate = self
        scrollView.addSubview(buyTypeView)
        
        buyInputView = (UINib(nibName: "BuyInputView", bundle: .main).instantiate(withOwner: nil, options: nil).first as! BuyInputView)
        buyInputView.frame = CGRect(x: scrollView.frame.size.width,
                                    y: 0,
                                    width: scrollView.frame.size.width,
                                    height: scrollView.frame.size.height)
        buyInputView.delegate = self
        scrollView.addSubview(buyInputView)
    }
    
    func changeView() {
        UIView.animate(withDuration: scrollTime) {
            self.scheduleImageView1.isHidden = false
            self.scheduleLabel1.isHidden = true
            self.oneToTwoLine.backgroundColor = UIColor.robinWggBlue
            self.scheduleLabel2.backgroundColor = UIColor.aqua
            self.scrollView.contentOffset = CGPoint(x: self.scrollView.frame.size.width,
                                               y: 0)
        }
    }
    
    func nextView() {
        
    }
    
    func backView() {
        UIView.animate(withDuration: scrollTime) {
            self.scheduleImageView1.isHidden = true
            self.scheduleLabel1.isHidden = false
            self.oneToTwoLine.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
            self.scheduleLabel2.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.12)
            self.scrollView.contentOffset = CGPoint(x: 0,
                                                    y: 0)
        }
    }
}
