#!/usr/bin/env python3
"""
将七大银行贷款产品Excel转换为RAG知识库JSON
"""
import openpyxl
import json
import os

def load_excel_data():
    """加载Excel数据"""
    wb = openpyxl.load_workbook(
        '/Users/wdxsg01/.openclaw/media/inbound/ä_å_é_è_ä¼_ä_è_æ_¾äº_å_å_æ_æ_å_v6---77a7fd29-3e24-4d68-8315-36f86070ffb2.xlsx',
        data_only=True
    )
    return wb['七大行贷款总览（含准入条件）']

KNOWN_BANKS = ['中国银行', '农业银行', '工商银行', '建设银行', '招商银行', '浦发银行', '杭州银行']

def parse_products(ws):
    """解析产品数据"""
    products = []
    current_bank = None
    skip_values = {'银行', '说明：'}

    for i, row in enumerate(ws.iter_rows(values_only=True)):
        cell_val = row[0]
        
        # 跳过标题和说明行
        if i < 2 or cell_val in skip_values or (isinstance(cell_val, str) and cell_val.startswith('LPR基准')):
            continue
        
        # 如果是已知的银行名称，更新当前银行
        if cell_val in KNOWN_BANKS:
            current_bank = cell_val
            # 不要continue，继续处理这一行（银行名占用列A，产品信息在列B开始）
        
        # 跳过空行
        if cell_val is None:
            continue

        # 确保在有效的银行下
        if current_bank is None:
            continue

        # 解析产品数据
        product = {
            'bank': current_bank,
            'product_name': row[1] if row[1] else '',
            'loan_type': row[2] if row[2] else '',
            'loan_term': row[3] if row[3] else '',
            'interest_rate': row[4] if row[4] else '',
            'loan_amount': row[5] if row[5] else '',
            'guarantee_method': row[6] if row[6] else '',
            'target': row[7] if row[7] else '',
            'asset_liability_ratio': row[8] if row[8] else '',
            'scale_revenue': row[9] if row[9] else '',
            'operation_years': row[10] if row[10] else '',
            'credit_rating': row[11] if row[11] else '',
            'special_conditions': row[12] if row[12] else ''
        }

        # 跳过没有产品名称的行
        if product['product_name']:
            products.append(product)

    return products

def convert_to_markdown(product):
    """将产品转换为Markdown格式"""
    md = f"""# {product['bank']} - {product['product_name']}

## 基本信息
- **银行**: {product['bank']}
- **产品名称**: {product['product_name']}
- **贷款类型**: {product['loan_type']}
- **贷款期限**: {product['loan_term']}
- **参考利率**: {product['interest_rate']}
- **贷款额度**: {product['loan_amount']}

## 准入条件
- **担保方式**: {product['guarantee_method']}
- **适用对象**: {product['target']}
- **资产负债率要求**: {product['asset_liability_ratio']}
- **企业规模/营收要求**: {product['scale_revenue']}
- **经营年限要求**: {product['operation_years']}
- **信用评级/征信要求**: {product['credit_rating']}

## 特殊条件
{product['special_conditions']}
"""
    return md

def create_rag_documents(products):
    """创建RAG文档"""
    docs = []
    for p in products:
        doc = {
            'id': f"{p['bank']}_{p['product_name']}".replace(' ', '_').replace('/', '_'),
            'type': 'loan_product',
            'bank': p['bank'],
            'product_name': p['product_name'],
            'content': convert_to_markdown(p),
            'metadata': {
                'loan_type': p['loan_type'],
                'interest_rate': p['interest_rate'],
                'loan_amount': p['loan_amount'],
                'guarantee_method': p['guarantee_method'],
                'asset_liability_ratio': p['asset_liability_ratio'],
                'operation_years': p['operation_years'],
                'credit_rating': p['credit_rating']
            }
        }
        docs.append(doc)
    return docs

def main():
    print("📊 开始转换Excel到知识库...")

    # 加载并解析数据
    ws = load_excel_data()
    products = parse_products(ws)
    print(f"✅ 解析到 {len(products)} 个产品")

    # 去重（根据银行+产品名）
    seen = set()
    unique_products = []
    for p in products:
        key = f"{p['bank']}_{p['product_name']}"
        if key not in seen:
            seen.add(key)
            unique_products.append(p)
    print(f"✅ 去重后 {len(unique_products)} 个产品")

    # 创建RAG文档
    docs = create_rag_documents(unique_products)

    # 保存JSON格式
    output_dir = '/Users/wdxsg01/.openclaw/workspaces/bot3/projects/loan-ai-backend/knowledge-base'
    os.makedirs(output_dir, exist_ok=True)

    with open(f'{output_dir}/loan_products.json', 'w', encoding='utf-8') as f:
        json.dump({
            'version': '1.0',
            'update_date': '2026-07-12',
            'total_products': len(unique_products),
            'products': unique_products
        }, f, ensure_ascii=False, indent=2)
    print(f"✅ 已保存产品数据到 {output_dir}/loan_products.json")

    # 保存RAG文档
    with open(f'{output_dir}/rag_documents.json', 'w', encoding='utf-8') as f:
        json.dump({
            'version': '1.0',
            'update_date': '2026-07-12',
            'total': len(docs),
            'documents': docs
        }, f, ensure_ascii=False, indent=2)
    print(f"✅ 已保存RAG文档到 {output_dir}/rag_documents.json")

    # 保存Markdown版本（便于查看）
    markdown_dir = f'{output_dir}/markdown'
    os.makedirs(markdown_dir, exist_ok=True)
    for doc in docs:
        filename = f"{doc['id']}.md"
        with open(f'{markdown_dir}/{filename}', 'w', encoding='utf-8') as f:
            f.write(doc['content'])
    print(f"✅ 已保存Markdown文档到 {markdown_dir}/")

    print("\n🎉 知识库转换完成！")

if __name__ == '__main__':
    main()
