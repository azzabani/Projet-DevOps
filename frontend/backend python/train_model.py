from sklearn.linear_model import LinearRegression
import joblib
import numpy as np
# Exemple : modèle qui apprend y = 2x + 1
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([3, 5, 7, 9, 11])
model = LinearRegression()
model.fit(X, y)
# Sauvegarde du modèle
joblib.dump(model, "model.pkl")
print("✅ Modèle entraîné et sauvegardé sous model.pkl")
