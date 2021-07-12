//
//  WaitSignTagViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/30.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxCocoa
import RxSwift


class WaitSignTagViewController: UIViewController {
    let disposed = DisposeBag()
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var scrollContentView: UIView!
    @IBOutlet weak var closeButton: RaisedButton! {
        didSet {
            closeButton.nonBoder()
        }
    }
    @IBOutlet weak var contentView: UIView! {
        didSet {
            contentView.layer.cornerRadius = 8.0
        }
    }
    
    @IBOutlet weak var startDateView: UIView! {
        didSet {
            startDateView.borderColor = UIColor.lightPeriwinkle
            startDateView.layer.cornerRadius = 8
            startDateView.layer.borderWidth = 1
        }
    }
    
    @IBOutlet weak var startDateImageView: UIImageView!
    @IBOutlet weak var startDateLabel: UILabel!
    
    @IBOutlet weak var toLabel: UILabel! {
        didSet {
            toLabel.s()
            toLabel.textColor = UIColor.coolGrey
        }
    }
    @IBOutlet weak var endDateView: UIView! {
        didSet {
            endDateView.borderColor = UIColor.lightPeriwinkle
            endDateView.layer.cornerRadius = 8
            endDateView.layer.borderWidth = 1
        }
    }
    @IBOutlet weak var endDateImageView: UIImageView!
    @IBOutlet weak var endDateLabel: UILabel!
    @IBOutlet weak var clearButton: RaisedButton! {
        didSet {
            clearButton.nonBoder()
        }
    }
    
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xs()
            titleLabel.textColor = UIColor.dark40
        }
    }
    
    @IBOutlet weak var bgView: UIView!
    @IBOutlet weak var tagTitleLabel: UILabel!
    @IBOutlet weak var tagCountLabel: UILabel!
    
    @IBOutlet weak var defineButton: RaisedButton! {
        didSet {
            defineButton.nonBoder()
            defineButton.backgroundColor = UIColor.aqua
            defineButton.layer.cornerRadius = 18
            defineButton.titleColor = UIColor.white
        }
    }
    @IBOutlet weak var cancelButton: RaisedButton! {
        didSet {
            cancelButton.shadowColor = UIColor.coolGrey
            cancelButton.layer.cornerRadius = 18
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    
    private func setup() {
        closeButton.rx.tap.subscribe(onNext: {
            self.dismiss(animated: true, completion: nil)
        }).disposed(by: disposed)
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
